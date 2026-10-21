// Brief data for mention popovers (cases: citation, ratio, why-here; authorities: text, gloss, applying cases).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const clip = (s: string | undefined, n: number) => { const t = (s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  const names = new Map(cases.map((c) => [c.id, c.data.name]));
  const out = {
    cases: Object.fromEntries(cases.map((c) => [c.id, { n: c.data.name, c: c.data.citation, r: clip(c.data.ratio, 320), w: clip(c.data['why-here'], 200), v: c.data.verify }])),
    authorities: Object.fromEntries((await getCollection('authorities')).map((a) => [a.id, { t: a.data.title, k: a.data.kind, x: clip(a.data.text, 360), g: clip(a.data.gloss, 240), cs: a.data.cases.map((id) => ({ id, n: names.get(id) ?? id })), v: a.data.verify }])),
  };
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
};
