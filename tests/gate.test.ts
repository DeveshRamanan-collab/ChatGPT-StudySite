import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const GATE = resolve('scripts/gate.mjs');
const stamp = 'source-hash: x\ngenerator-version: x\ngenerated-at: x\n';
let dir: string;

const write = (rel: string, body: string) => {
  const p = join(dir, 'src/content', rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, `---\n${stamp}${body}---\n`);
};
const gate = (env: Record<string, string> = {}) =>
  spawnSync('node', [GATE], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } });

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'gate-'));
  write('cards/test1000-w01-c01.md', 'type: basic\nconcept: test1000-a\nfront: a\nback: b\n');
  write('cards/test1000-w01-c02.md', 'type: basic\nconcept: test1000-a\nfront: c\nback: d\n');
  write('cards/test1000-w02-c01.md', 'type: basic\nconcept: test1000-b\nfront: e\nback: f\n');
  write('cards/seed/seed-c01.md', 'type: basic\nconcept: seed\nfront: s\nback: s\n');
  expect(gate().status).toBe(0); // baseline
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('gate', () => {
  it('records counts, excluding seed', () => {
    const report = JSON.parse(readFileSync(join(dir, 'reports/gate.json'), 'utf8'));
    expect(report.counts.cards).toBe(3);
  });

  it('passes when nothing changed', () => {
    expect(gate().status).toBe(0);
  });

  it('fails when a card is removed', () => {
    rmSync(join(dir, 'src/content/cards/test1000-w01-c02.md'));
    const r = gate();
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/count decreased: cards 3 -> 2/);
  });

  it('fails when ADD_WEEK touches a file outside that week', () => {
    write('cards/test1000-w01-c01.md', 'type: basic\nconcept: test1000-a\nfront: changed\nback: b\n');
    const r = gate({ ADD_WEEK: 'test1000-w02' });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/changed outside test1000-w02: cards\/test1000-w01-c01.md/);
  });

  it('allows changes inside the week being added', () => {
    write('cards/test1000-w02-c01.md', 'type: basic\nconcept: test1000-b\nfront: changed\nback: f\n');
    expect(gate({ ADD_WEEK: 'test1000-w02' }).status).toBe(0);
  });
});
