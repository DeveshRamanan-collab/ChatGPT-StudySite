// Content address of a raw week folder: sha256 over sorted relative paths + bytes. Usage: node scripts/source-hash.mjs <dir>
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

// Files over GitHub's limit can't be committed, so they can't be part of a reproducible content address. Each one is
// kept locally (gitignored) with a committed "<name> (text extract).md" beside it, which is what gets hashed and read.
export const MAX_RAW_BYTES = 95e6;

export function listFiles(dir, acc = []) {
  for (const e of readdirSync(dir).sort()) {
    if (e.startsWith('.')) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) listFiles(p, acc);
    else if (st.size <= MAX_RAW_BYTES) acc.push(p);
  }
  return acc;
}

export function sourceHash(dir) {
  const h = createHash('sha256');
  for (const f of listFiles(dir)) {
    h.update(relative(dir, f).normalize('NFC'));
    h.update('\0');
    h.update(readFileSync(f));
    h.update('\0');
  }
  return h.digest('hex').slice(0, 16);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const d of process.argv.slice(2)) console.log(`${sourceHash(d)}  ${d}`);
}
