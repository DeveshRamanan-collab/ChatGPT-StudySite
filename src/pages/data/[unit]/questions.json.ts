// Static JSON of a unit's question bank for the quiz islands (keeps large banks out of the HTML).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { units, questionsOf, conceptsOf, conceptSlug, weeksOf } from '../../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => (await units()).map((u) => ({ params: { unit: u.id } }));

export const GET: APIRoute = async ({ params }) => {
  const unit = params.unit!;
  const concepts = await conceptsOf(unit);
  const meta = Object.fromEntries(concepts.map((c) => [c.id, { title: c.data.title, href: `/${unit}/concept/${conceptSlug(c)}`, week: c.data.week, dependsOn: c.data['depends-on'], contrastsWith: c.data['contrasts-with'] }]));
  const questions = (await questionsOf(unit)).map((q) => {
    const { seed, locked, verify, ['source-hash']: _h, ['generator-version']: _g, ['generated-at']: _a, ...d } = q.data;
    return { id: q.id, unit, ...d, week: d.week ?? meta[d.concept]?.week };
  });
  const weeks = (await weeksOf(unit)).map((w) => ({ id: w.id, number: w.data.number, topic: w.data.topic }));
  // Case ↔ ratio pairs for Match mode (cases linked from this unit's concepts; unverified cases left out).
  const caseIds = new Set(concepts.flatMap((c) => c.data.cases));
  const cases = (await getCollection('cases', (k) => caseIds.has(k.id) && !k.data.verify)).map((k) => ({ id: k.id, name: k.data.name, ratio: k.data.ratio }));
  return new Response(JSON.stringify({ unit, concepts: meta, weeks, cases, questions }), { headers: { 'content-type': 'application/json' } });
};
