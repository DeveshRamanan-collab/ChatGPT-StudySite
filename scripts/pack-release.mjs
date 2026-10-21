// Pack a tested static build into deterministic, checksum-verified GitHub-sized parts.
import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream} from 'node:fs';
import {lstat, mkdir, mkdtemp, open, readFile, readdir, rename, rm, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createGzip} from 'node:zlib';
import {execFileSync} from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLOCK = 512;
const PART_BYTES = 4 * 1024 * 1024;
export const RELEASE_FORMAT = 'study-site-release-v1';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function safeEntryPath(name) {
  if(typeof name !== 'string' || !name.startsWith('dist/') || name.endsWith('/') ||
      name.includes('\\') || name.includes('\0') || name.split('/').some(p => !p || p === '.' || p === '..')) {
    throw new Error(`Unsafe release entry: ${JSON.stringify(name)}`);
  }
  return name;
}

function octal(header, offset, width, value) {
  const text = value.toString(8);
  if(text.length > width - 1) throw new Error('Release tar field is too large');
  header.write(text.padStart(width - 1, '0') + '\0', offset, width, 'ascii');
}

function tarHeader(name, bytes) {
  safeEntryPath(name);
  let suffix = name, prefix = '';
  if(Buffer.byteLength(suffix) > 100) {
    let split = name.lastIndexOf('/');
    while(split > 0) {
      const a = name.slice(0, split), b = name.slice(split + 1);
      if(Buffer.byteLength(a) <= 155 && Buffer.byteLength(b) <= 100) {prefix = a; suffix = b; break;}
      split = name.lastIndexOf('/', split - 1);
    }
    if(!prefix) throw new Error(`Release path exceeds safe ustar limits: ${name}`);
  }
  const header = Buffer.alloc(BLOCK);
  header.write(suffix, 0, 100, 'utf8');
  octal(header, 100, 8, 0o644);
  octal(header, 108, 8, 0); octal(header, 116, 8, 0);
  octal(header, 124, 12, bytes); octal(header, 136, 12, 0);
  header.fill(32, 148, 156);
  header.write('0', 156, 1, 'ascii');
  header.write('ustar\0', 257, 6, 'ascii'); header.write('00', 263, 2, 'ascii');
  if(prefix) header.write(prefix, 345, 155, 'utf8');
  const checksum = header.reduce((a, b) => a + b, 0);
  header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');
  return header;
}

async function inventory(directory, root) {
  const files = [];
  async function walk(path) {
    for(const name of (await readdir(path)).sort()) {
      const full = join(path, name), stat = await lstat(full);
      if(stat.isSymbolicLink()) throw new Error(`Release cannot contain a symlink: ${full}`);
      if(stat.isDirectory()) await walk(full);
      else if(stat.isFile()) {
        const path = safeEntryPath(relative(root, full).split(sep).join('/'));
        const hash = createHash('sha256');
        for await(const bytes of createReadStream(full)) hash.update(bytes);
        files.push({path, bytes:stat.size, sha256:hash.digest('hex')});
      } else throw new Error(`Release cannot contain a special file: ${full}`);
    }
  }
  await walk(directory);
  return files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

async function* tarStream(root, files) {
  for(const file of files) {
    yield tarHeader(file.path, file.bytes);
    const hash = createHash('sha256'); let read = 0;
    for await(const bytes of createReadStream(join(root, file.path))) {hash.update(bytes); read += bytes.length; yield bytes;}
    if(read !== file.bytes || hash.digest('hex') !== file.sha256) throw new Error(`Build changed during packaging: ${file.path}`);
    const padding = (BLOCK - file.bytes % BLOCK) % BLOCK;
    if(padding) yield Buffer.alloc(padding);
  }
  yield Buffer.alloc(BLOCK * 2);
}

export async function packRelease({root = ROOT, output = join(root, 'release-assets'), sourceCommit, partBytes = PART_BYTES} = {}) {
  root = resolve(root); output = resolve(output);
  if(!Number.isSafeInteger(partBytes) || partBytes < 512 || partBytes > PART_BYTES) throw new Error('Release part size must be between 512 bytes and 4 MiB');
  const files = await inventory(join(root, 'dist'), root);
  if(!files.some(f => f.path === 'dist/index.html')) throw new Error('Cannot package a build without dist/index.html');
  await mkdir(dirname(output), {recursive:true});
  const temp = await mkdtemp(join(dirname(output), '.release-pack-'));
  let backup;
  try {
    const archive = join(temp, 'build.tar.gz');
    await pipeline(Readable.from(tarStream(root, files)), createGzip({level:9}), createWriteStream(archive, {flags:'wx'}));
    const target = join(temp, 'parts'); await mkdir(target);
    const handle = await open(archive, 'r');
    const parts = [], archiveHash = createHash('sha256'); let archiveBytes = 0;
    try {
      for(let number = 0; ; number++) {
        const bytes = Buffer.allocUnsafe(partBytes);
        let used = 0;
        while(used < partBytes) {const read = await handle.read(bytes, used, partBytes - used, null); if(!read.bytesRead) break; used += read.bytesRead;}
        if(!used) break;
        const data = bytes.subarray(0, used), filename = `part-${String(number).padStart(5, '0')}.bin`;
        archiveHash.update(data); archiveBytes += used;
        await writeFile(join(target, filename), data, {flag:'wx'});
        parts.push({filename, bytes:used, sha256:sha(data)});
      }
    } finally {await handle.close();}
    if(sourceCommit === undefined) {
      try {sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8', stdio:['ignore','pipe','ignore']}).trim();} catch {sourceCommit = null;}
    }
    const manifest = {format:RELEASE_FORMAT, sourceCommit, archive:{format:'tar.gz', bytes:archiveBytes, sha256:archiveHash.digest('hex')},
      fileCount:files.length, totalFileBytes:files.reduce((n, f) => n + f.bytes, 0), files, parts};
    await writeFile(join(target, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    try {await lstat(output); backup = join(temp, 'previous-release'); await rename(output, backup);} catch(error) {if(error.code !== 'ENOENT') throw error;}
    try {await rename(target, output);} catch(error) {if(backup) await rename(backup, output); throw error;}
    return manifest;
  } finally {await rm(temp, {recursive:true, force:true});}
}

if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2); const rootIndex = args.indexOf('--root');
  packRelease({root:rootIndex >= 0 ? resolve(args[rootIndex + 1]) : ROOT}).then(m => console.log(JSON.stringify({files:m.fileCount, parts:m.parts.length, archiveBytes:m.archive.bytes, sha256:m.archive.sha256})))
    .catch(error => {console.error(`[release] ${error.message}`); process.exitCode = 1;});
}
