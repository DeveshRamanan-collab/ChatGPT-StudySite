// The unit's pretest questions only (5 per week) in the bank's shape, so a first week visit loads kilobytes.
import type { APIRoute, GetStaticPaths } from 'astro';
import { units, weeksOf } from '../../../lib/content';
import { GET as bankGET } from './questions.json';

export const getStaticPaths: GetStaticPaths = async () => (await units()).map((u) => ({ params: { unit: u.id } }));

export const GET: APIRoute = async (ctx) => {
  const bank = await (await (bankGET as any)(ctx)).json();
  const ids = new Set((await weeksOf(ctx.params.unit!)).flatMap((w) => w.data.pretest));
  bank.questions = bank.questions.filter((q: { id: string }) => ids.has(q.id));
  bank.cases = [];
  return new Response(JSON.stringify(bank), { headers: { 'content-type': 'application/json' } });
};
