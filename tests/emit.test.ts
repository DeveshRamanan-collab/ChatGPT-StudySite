import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const EMIT = resolve('scripts/emit.mjs');
let dir: string;
const run = () => spawnSync('node', [EMIT, 'content-src/test1000-w02.yaml'], { cwd: dir, encoding: 'utf8' });
const spec = `unit: test1000
week: 2
source: raw/test/week-02
generator: ingest-1
week_file:
  topic: Topic
  summary: One. Two. Three.
  notes: |
    ## Heading
    Body text.
concepts:
  - slug: alpha
    title: Alpha
    visual: diagram
    visual-brief: A box.
    depends-on: [test1000-w01-base]
    body: Alpha body.
questions:
  - key: a1
    type: truefalse
    concept: alpha
    statement: S
    answer: true
    why: W
  - key: a2
    type: truefalse
    concept: alpha
    variant-of: a1
    statement: S2
    answer: false
    why: W2
pretest: [a1]
cards:
  - type: basic
    concept: alpha
    front: F
    back: B
`;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'emit-'));
  mkdirSync(join(dir, 'raw/test/week-02'), { recursive: true });
  writeFileSync(join(dir, 'raw/test/week-02/notes.md'), 'hello');
  mkdirSync(join(dir, 'content-src'));
  writeFileSync(join(dir, 'content-src/test1000-w02.yaml'), spec);
  mkdirSync(join(dir, 'node_modules'));
  // resolve js-yaml from the project
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('emit', () => {
  it('writes week-prefixed, stamped files and resolves local ids', () => {
    const r = run();
    expect(r.status, r.stderr).toBe(0);
    expect(readdirSync(join(dir, 'src/content/questions')).sort()).toEqual(['test1000-w02-q001.md', 'test1000-w02-q002.md']);
    const q2 = readFileSync(join(dir, 'src/content/questions/test1000-w02-q002.md'), 'utf8');
    expect(q2).toMatch(/variant-of: test1000-w02-q001/);
    expect(q2).toMatch(/concept: test1000-w02-alpha/);
    expect(q2).toMatch(/source-hash: [0-9a-f]{16}/);
    const w = readFileSync(join(dir, 'src/content/weeks/test1000-w02.md'), 'utf8');
    expect(w).toMatch(/pretest:\n  - test1000-w02-q001/);
    const c = readFileSync(join(dir, 'src/content/concepts/test1000-w02-alpha.md'), 'utf8');
    expect(c).toMatch(/depends-on:\n  - test1000-w01-base/); // cross-week id passes through
  });

  it('is idempotent: a second run changes nothing', () => {
    run();
    const before = readFileSync(join(dir, 'src/content/questions/test1000-w02-q001.md'), 'utf8');
    const r = run();
    expect(r.stdout).toMatch(/created\s+0/);
    expect(r.stdout).toMatch(/updated\s+0/);
    expect(readFileSync(join(dir, 'src/content/questions/test1000-w02-q001.md'), 'utf8')).toBe(before);
  });

  it('never touches locked files, and restamps when the raw folder changes', () => {
    run();
    const p = join(dir, 'src/content/cards/test1000-w02-c001.md');
    const locked = readFileSync(p, 'utf8').replace('locked: false', 'locked: true').replace('front: F', 'front: Hand-edited');
    writeFileSync(p, locked);
    writeFileSync(join(dir, 'raw/test/week-02/notes.md'), 'hello world');
    const r = run();
    expect(r.stdout).toMatch(/locked\s+1/);
    expect(readFileSync(p, 'utf8')).toBe(locked);
    expect(r.stdout).toMatch(/updated\s+[1-9]/);
  });
});
