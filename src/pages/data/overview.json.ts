// Units → weeks → concepts, for islands that need the whole map (dashboard, home, plan, hub).
import type { APIRoute } from 'astro';
import { units, weeksOf, conceptsOf, conceptSlug } from '../../lib/content';
import { examOf } from '../../lib/exam';

export const GET: APIRoute = async () => {
  const out = [];
  for (const u of await units()) {
    const concepts = await conceptsOf(u.id);
    const byId = new Map(concepts.map((c) => [c.id, c]));
    const weeks = (await weeksOf(u.id)).map((w) => ({
      id: w.id, number: w.data.number, topic: w.data.topic, href: `/${u.id}/week/${w.data.number}`,
      concepts: w.data.concepts.filter((id) => byId.has(id)).map((id) => {
        const d = byId.get(id)!.data as Record<string, any>;
        return { id, title: d.title, href: `/${u.id}/concept/${conceptSlug(byId.get(id)!)}`, dependsOn: d['depends-on'] ?? [], contrasts: d['contrasts-with'] ?? [], related: d.related ?? [] };
      }),
    }));
    out.push({ id: u.id, code: u.data.code, name: u.data.name, examDate: +u.data['exam-start'], exam: examOf(u.data), weeksExpected: u.data['weeks-expected'], answerStyle: u.data['answer-style'], weeks });
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
};
