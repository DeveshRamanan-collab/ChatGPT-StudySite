// Merges src/components/explainers/manifest-parts/*.json (one per agent/week) into manifest.json.
// Append-only: an id already in manifest.json keeps its entry. Parts are deleted after a successful merge.
// Usage: node scripts/merge-manifest.mjs [part names, e.g. mgmt2094-w07] — no names merges every part.
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
const dir = 'src/components/explainers/manifest-parts';
const path = 'src/components/explainers/manifest.json';
const m = JSON.parse(readFileSync(path, 'utf8'));
let added = 0;
const only = process.argv.slice(2).map((n) => (n.endsWith('.json') ? n : `${n}.json`));
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && (!only.length || only.includes(f)))) {
  const part = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  for (const [k, v] of Object.entries(part)) if (!m[k]) { m[k] = v; added++; }
  unlinkSync(`${dir}/${f}`);
}
writeFileSync(path, JSON.stringify(m, null, 2) + '\n');
console.log(`manifest: +${added}, ${Object.keys(m).length} total`);
