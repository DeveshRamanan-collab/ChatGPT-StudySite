// Static JSON of a unit's study aids, decision flows and problem-fact annotations, loaded lazily by the practice
// islands (hint ladder, drills, element boards, issue spotting) so none of it weighs on the HTML.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { units, conceptsOf } from '../../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => (await units()).map((u) => ({ params: { unit: u.id } }));

const STAMP = ['seed', 'locked', 'source-hash', 'generator-version', 'generated-at'];
const clean = <T extends Record<string, unknown>>(d: T) => Object.fromEntries(Object.entries(d).filter(([k]) => !STAMP.includes(k)));

export const GET: APIRoute = async ({ params }) => {
  const unit = params.unit!;
  const ids = new Set((await conceptsOf(unit)).map((c) => c.id));
  const aids = Object.fromEntries((await getCollection('aids', (a) => ids.has(a.data.concept))).map((a) => [a.data.concept, clean(a.data)]));
  const flows = (await getCollection('flows', (f) => f.data.unit === unit)).map((f) => ({ id: f.id, ...clean(f.data) }));
  const facts = Object.fromEntries((await getCollection('facts', (f) => f.data.unit === unit)).map((f) => [f.data.question, clean(f.data)]));
  return new Response(JSON.stringify({ unit, aids, flows, facts }), { headers: { 'content-type': 'application/json' } });
};
