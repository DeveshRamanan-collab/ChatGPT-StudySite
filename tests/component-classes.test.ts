// Guard: page- or component-scoped <style> blocks must not redefine a shared component class from
// src/styles/components.css (e.g. a local `.chip { … }`). Astro scopes the rule to every element in that
// file, so it silently restyles the real component there. Contextual overrides such as `.list .card { … }`
// are fine; a selector that *starts* with a shared class is not.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const componentsCss = readFileSync('src/styles/components.css', 'utf8');
const shared = new Set(
  [...componentsCss.matchAll(/(?:^|[\s,{}])\.([a-z][\w-]*)/gm)]
    .map((m) => m[1])
    .filter((c) => !c.startsWith('is-') && !c.startsWith('demo-') && !c.startsWith('has-')),
);

function files(dir: string, acc: string[] = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files(p, acc);
    else if (/\.(astro|tsx|jsx)$/.test(e)) acc.push(p);
  }
  return acc;
}

function selectors(css: string) {
  const out: string[] = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/([^{}@;]+)\{/g)) for (const s of m[1].split(',')) out.push(s.trim());
  return out.filter(Boolean);
}

describe('scoped styles never redefine shared component classes', () => {
  it('knows the shared classes', () => {
    for (const c of ['btn', 'chip', 'card', 'option', 'kbd', 'stamp', 'toast', 'popover']) expect(shared.has(c), c).toBe(true);
  });

  for (const f of files('src')) {
    const src = readFileSync(f, 'utf8');
    const blocks = [...src.matchAll(/<style(?![^>]*is:global)[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
    if (!blocks.length) continue;
    it(f, () => {
      const bad = blocks.flatMap(selectors).filter((sel) => {
        const first = sel.replace(/^:global\(/, '').match(/^\.([a-z][\w-]*)/);
        return first !== null && shared.has(first[1]);
      });
      expect(bad, `rename these local classes or scope them under a page class`).toEqual([]);
    });
  }
});
