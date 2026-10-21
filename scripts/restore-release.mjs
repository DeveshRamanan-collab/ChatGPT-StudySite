// Restore the committed, tested build before Cloudflare invokes Wrangler.
// Uses local files only; archive checks complete before replacing generated dist/.
import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream} from 'node:fs';
import {access, cp, lstat, mkdir, mkdtemp, open, readFile, rename, rm, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {pipeline} from 'node:stream/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createGunzip} from 'node:zlib';
import {RELEASE_FORMAT, safeEntryPath} from './pack-release.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HASH = /^[a-f0-9]{64}$/;
const MAX_PART = 4 * 1024 * 1024;
const exists = async path => {try {await access(path); return true;} catch {return false;}};
async function writeAll(handle, bytes) {
  let offset = 0;
  while(offset < bytes.length) {
    const {bytesWritten} = await handle.write(bytes, offset, bytes.length - offset);
    if(!bytesWritten) throw new Error('Could not write the complete release file');
    offset += bytesWritten;
  }
}

function validateManifest(m) {
  if(m?.format !== RELEASE_FORMAT || m.archive?.format !== 'tar.gz' || !HASH.test(m.archive.sha256) ||
    !Number.isSafeInteger(m.archive.bytes) || m.archive.bytes <= 0 || !Array.isArray(m.parts) || !m.parts.length || !Array.isArray(m.files)) throw new Error('Invalid release manifest');
  const names = new Set(), files = new Map(); let bytes = 0, total = 0;
  for(const [number, p] of m.parts.entries()) {
    if(p.filename !== `part-${String(number).padStart(5, '0')}.bin` || names.has(p.filename) || !HASH.test(p.sha256) ||
      !Number.isSafeInteger(p.bytes) || p.bytes <= 0 || p.bytes > MAX_PART) throw new Error('Invalid release part descriptor');
    names.add(p.filename); bytes += p.bytes;
  }
  for(const f of m.files) {
    safeEntryPath(f.path);
    if(files.has(f.path) || !HASH.test(f.sha256) || !Number.isSafeInteger(f.bytes) || f.bytes < 0) throw new Error('Invalid or duplicate release file');
    files.set(f.path, f); total += f.bytes;
  }
  if(bytes !== m.archive.bytes || files.size !== m.fileCount || total !== m.totalFileBytes || !files.has('dist/index.html')) throw new Error('Release manifest totals do not match');
  return files;
}

async function validExisting(root, files) {
  for(const f of files.values()) {
    const path = join(root, f.path);
    try {
      const stat = await lstat(path);
      if(!stat.isFile() || stat.isSymbolicLink() || stat.size !== f.bytes) return false;
      const hash = createHash('sha256'); for await(const bytes of createReadStream(path)) hash.update(bytes);
      if(hash.digest('hex') !== f.sha256) return false;
    } catch {return false;}
  }
  return true;
}

class Bytes {
  constructor(source) {this.iterator = source[Symbol.asyncIterator](); this.pending = Buffer.alloc(0);}
  async take(max) {
    while(!this.pending.length) {const next = await this.iterator.next(); if(next.done) return null; this.pending = Buffer.from(next.value);}
    const value = this.pending.subarray(0, max); this.pending = this.pending.subarray(value.length); return value;
  }
  async exact(size) {
    const out = Buffer.alloc(size); let position = 0;
    while(position < size) {const bytes = await this.take(size - position); if(!bytes) throw new Error('Truncated release archive'); bytes.copy(out, position); position += bytes.length;}
    return out;
  }
}
const string = bytes => bytes.subarray(0, bytes.indexOf(0) < 0 ? bytes.length : bytes.indexOf(0)).toString('utf8');
function number(bytes) {const text = string(bytes).trim(); if(!/^[0-7]+$/.test(text)) throw new Error('Invalid release tar number'); const value = parseInt(text, 8); if(!Number.isSafeInteger(value)) throw new Error('Oversized release tar number'); return value;}

async function unpack(source, target, files) {
  const reader = new Bytes(source), seen = new Set();
  for(;;) {
    const header = await reader.exact(512);
    if(header.every(v => v === 0)) {
      const end = await reader.exact(512); if(!end.every(v => v === 0)) throw new Error('Invalid release archive terminator');
      for(let rest; (rest = await reader.take(64 * 1024));) if(!rest.every(v => v === 0)) throw new Error('Unexpected data after release archive');
      break;
    }
    const expected = number(header.subarray(148, 156));
    const checksum = header.reduce((sum, v, i) => sum + (i >= 148 && i < 156 ? 32 : v), 0);
    if(checksum !== expected || string(header.subarray(257, 263)) !== 'ustar') throw new Error('Invalid release tar header');
    if(header[156] !== 48 && header[156] !== 0) throw new Error('Release archive contains a symlink, directory or unsupported entry');
    if(string(header.subarray(157, 257))) throw new Error('Release archive contains a link target');
    const suffix = string(header.subarray(0, 100)), prefix = string(header.subarray(345, 500));
    const name = safeEntryPath(prefix ? `${prefix}/${suffix}` : suffix), size = number(header.subarray(124, 136));
    const item = files.get(name);
    if(!item || seen.has(name) || item.bytes !== size) throw new Error(`Unexpected release file: ${name}`);
    seen.add(name);
    const destination = join(target, name); await mkdir(dirname(destination), {recursive:true});
    const handle = await open(destination, 'wx', 0o644), hash = createHash('sha256'); let remaining = size;
    try {
      while(remaining) {const bytes = await reader.take(Math.min(64 * 1024, remaining)); if(!bytes) throw new Error('Truncated release file'); hash.update(bytes); await writeAll(handle, bytes); remaining -= bytes.length;}
    } finally {await handle.close();}
    if(hash.digest('hex') !== item.sha256) throw new Error(`Restored file checksum mismatch: ${name}`);
    const padding = (512 - size % 512) % 512;
    if(padding && !(await reader.exact(padding)).every(v => v === 0)) throw new Error('Invalid release tar padding');
  }
  if(seen.size !== files.size) throw new Error('Release archive omitted manifest files');
}

async function seedSources(root) {
  const seeded = [];
  const publicPath = join(root, 'public');
  if(await exists(publicPath) && (await lstat(publicPath)).isSymbolicLink()) throw new Error('The public source directory cannot be a symlink');
  for(const name of ['source-corpus', 'source-originals']) {
    const from = join(root, 'dist', name), to = join(root, 'public', name);
    if(await exists(from) && !await exists(to)) {await mkdir(dirname(to), {recursive:true}); await cp(from, to, {recursive:true, errorOnExist:true, force:false}); seeded.push(name);}
  }
  return seeded;
}

export async function restoreRelease({root = ROOT, requireSnapshot = false, log = console.log} = {}) {
  root = resolve(root); const assetDirectory = join(root, 'release-assets'), manifestPath = join(assetDirectory, 'manifest.json');
  if(!await exists(manifestPath)) {
    if(requireSnapshot) throw new Error('No committed release snapshot was found');
    log('[release] No release snapshot is committed yet; continuing source install.');
    return {restored:false, reason:'no-manifest'};
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')), files = validateManifest(manifest);
  if(await validExisting(root, files)) {const seeded = await seedSources(root); log(`[release] Existing dist matches all ${files.size} release files.`); return {restored:false, reason:'already-verified', files:files.size, seeded};}
  const temp = await mkdtemp(join(root, '.release-restore-'));
  try {
    const archivePath = join(temp, 'build.tar.gz'), output = await open(archivePath, 'wx');
    const fullHash = createHash('sha256'); let fullBytes = 0;
    try {
      for(const part of manifest.parts) {
        const path = join(assetDirectory, part.filename), stat = await lstat(path);
        if(!stat.isFile() || stat.isSymbolicLink() || stat.size !== part.bytes) throw new Error(`Release part is missing or has the wrong size: ${part.filename}`);
        const hash = createHash('sha256'); let read = 0;
        for await(const bytes of createReadStream(path)) {hash.update(bytes); fullHash.update(bytes); read += bytes.length; fullBytes += bytes.length; await writeAll(output, bytes);}
        if(read !== part.bytes || hash.digest('hex') !== part.sha256) throw new Error(`Release part checksum mismatch: ${part.filename}`);
      }
    } finally {await output.close();}
    if(fullBytes !== manifest.archive.bytes || fullHash.digest('hex') !== manifest.archive.sha256) throw new Error('Complete release archive checksum mismatch');
    const unpacked = join(temp, 'unpacked'); await mkdir(unpacked);
    await pipeline(createReadStream(archivePath), createGunzip(), async source => {await unpack(source, unpacked, files);});
    if(!await validExisting(unpacked, files)) throw new Error('Restored build verification failed');
    const destination = join(root, 'dist'), backup = join(temp, 'previous-dist'); let hadPrevious = false;
    if(await exists(destination)) {await rename(destination, backup); hadPrevious = true;}
    try {await rename(join(unpacked, 'dist'), destination);} catch(error) {if(hadPrevious) await rename(backup, destination); throw error;}
    const seeded = await seedSources(root);
    log(`[release] Restored and verified ${files.size} files from ${manifest.parts.length} release parts.`);
    return {restored:true, files:files.size, archiveSha256:manifest.archive.sha256, seeded};
  } finally {await rm(temp, {recursive:true, force:true});}
}

if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2), index = args.indexOf('--root');
  restoreRelease({root:index >= 0 ? resolve(args[index + 1]) : ROOT, requireSnapshot:args.includes('--require')})
    .catch(error => {console.error(`[release] ${error.message}`); process.exitCode = 1;});
}
