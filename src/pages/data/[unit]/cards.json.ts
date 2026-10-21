// Static JSON of a unit's flashcards for the review island (keeps the deck out of the HTML).
import type { APIRoute, GetStaticPaths } from 'astro';
import { units, cardsOf, conceptsOf, conceptSlug } from '../../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => (await units()).map((u) => ({ params: { unit: u.id }, props: { u } }));

export const GET: APIRoute = async ({ params, props }) => {
  const unit = params.unit!;
  const u = (props as any).u;
  const concepts = await conceptsOf(unit);
  const meta = Object.fromEntries(concepts.map((c) => [c.id, { title: c.data.title, href: `/${unit}/concept/${conceptSlug(c)}`, week: c.data.week }]));
  const cards = (await cardsOf(unit)).map((c) => {
    const { seed, locked, verify, ['source-hash']: _h, ['generator-version']: _g, ['generated-at']: _a, ...d } = c.data as Record<string, any>;
    return { id: c.id, unit, ...d, week: d.week ?? meta[d.concept]?.week };
  });
  return new Response(JSON.stringify({ unit, code: u.data.code, examDate: +u.data['exam-start'], concepts: meta, cards }), { headers: { 'content-type': 'application/json' } });
};
