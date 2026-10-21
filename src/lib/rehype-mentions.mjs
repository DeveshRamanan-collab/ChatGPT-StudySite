// Links every mention of a known case or authority in rendered notes: <a class="mention" data-case="slug">.
// Names come from src/content/cases and src/content/authorities (read once per build). Longest names match first;
// text already inside a link, heading or code is left alone. Popovers are wired client-side (src/lib/mentions.ts).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

function load(dir, key) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const m = readFileSync(join(dir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const d = yaml.load(m[1], { schema: yaml.JSON_SCHEMA }) ?? {};
    const name = String(d[key] ?? '').trim();
    if (name.length >= 6) out.push({ name, slug: f.replace(/\.md$/, '') });
  }
  return out;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SKIP = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style']);

export function mentionMatcher(root = 'src/content') {
  const entries = [
    ...load(join(root, 'cases'), 'name').map((e) => ({ ...e, attr: 'data-case', href: `/cases/${e.slug}` })),
    ...load(join(root, 'authorities'), 'title').map((e) => ({ ...e, attr: 'data-authority', href: `/authorities/${e.slug}` })),
  ].sort((a, b) => b.name.length - a.name.length);
  const byName = new Map(entries.map((e) => [e.name.toLowerCase(), e]));
  const re = entries.length ? new RegExp(`(?<![\\w])(${entries.map((e) => esc(e.name)).join('|')})(?![\\w])`, 'gi') : null;
  return { re, byName };
}

export default function rehypeMentions() {
  let cache = null;
  return (tree) => {
    const { re, byName } = (cache ??= mentionMatcher());
    if (!re) return;
    const walk = (node) => {
      if (!node.children) return;
      const next = [];
      for (const child of node.children) {
        if (child.type === 'element') {
          if (!SKIP.has(child.tagName)) walk(child);
          next.push(child);
          continue;
        }
        if (child.type !== 'text' || !re.test(child.value)) { next.push(child); continue; }
        re.lastIndex = 0;
        let last = 0;
        for (const m of child.value.matchAll(re)) {
          const e = byName.get(m[1].toLowerCase());
          if (!e) continue;
          if (m.index > last) next.push({ type: 'text', value: child.value.slice(last, m.index) });
          next.push({ type: 'element', tagName: 'a', properties: { href: e.href, className: ['mention'], [e.attr === 'data-case' ? 'dataCase' : 'dataAuthority']: e.slug, dataCursor: 'link' }, children: [{ type: 'text', value: m[1] }] });
          last = m.index + m[1].length;
        }
        if (last < child.value.length) next.push({ type: 'text', value: child.value.slice(last) });
      }
      node.children = next;
    };
    walk(tree);
  };
}
