import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { validate } from '../scripts/validate.mjs';

describe('validate', () => {
  // The real tree is ~10k files since the study aids landed; validation takes several seconds on a busy machine.
  it('passes on the real content tree', () => {
    const r = validate('src/content');
    expect(r.errors).toEqual([]);
  }, 60_000);

  it('fails on a dangling concept id', () => {
    const r = validate('tests/fixtures/validate-dangling');
    expect(r.errors.join('\n')).toMatch(/unknown concepts id "test1000-no-such-concept"/);
    const cli = spawnSync('node', ['scripts/validate.mjs', 'tests/fixtures/validate-dangling'], { encoding: 'utf8' });
    expect(cli.status).toBe(1);
  });

  it('fails on a dangling depends-on edge', () => {
    const r = validate('tests/fixtures/validate-depends');
    expect(r.errors.join('\n')).toMatch(/depends-on → unknown concepts id "test1000-missing"/);
  });
});
