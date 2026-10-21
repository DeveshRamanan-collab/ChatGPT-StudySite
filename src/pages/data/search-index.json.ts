// Build-generated index for the command palette (Fuse.js on the client; annotations are merged in at runtime).
// Compact keys: k kind, t title, s subtitle, h href, u unit, w week number, id question id.
import {getJumpIndex} from '../../lib/rebuild';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { units, weeksOf, conceptsOf, conceptSlug, questionsOf } from '../../lib/content';
import { examDayLabel, examTimeLabel, minutesLabel } from '../../lib/exam';

export const GET: APIRoute = async () => {
  const items: Record<string, unknown>[] = [
    { k: 'page', t: 'Units', s: 'Home', h: '/' },
    { k: 'page', t: 'Dashboard', s: 'Progress and readiness', h: '/dashboard' },
    { k: 'page', t: 'Study plan', s: 'Day by day to the exams', h: '/plan' },
    { k: 'page', t: 'Exam paper — all units', s: 'Interleaved, certainty-marked', h: '/exam' },
    { k: 'page', t: 'Search', s: 'Full-text search', h: '/search' },
  ];
  for(const x of await getJumpIndex()) if(!items.some(i=>String(i.h).replace(/\/$/,'')===x.href.replace(/\/$/,''))) items.push({k:'page',t:x.title,s:x.description||x.kind,h:x.href,u:x.unit});
  const unitIds = new Set<string>();
  for (const u of await units()) {
    unitIds.add(u.id);
    const code = u.data.code;
    items.push(
      { k: 'page', t: `${code} ${u.data.name}`, s: 'Unit hub', h: `/${u.id}`, u: u.id },
      { k: 'page', t: `${code} exam · ${examDayLabel(+u.data['exam-start'])} ${examTimeLabel(+u.data['exam-start'])}`, s: `${u.data['exam-mode']}${u.data['exam-status'] === 'draft' ? ' · draft timetable' : ''}`, h: `/${u.id}#exam`, u: u.id },
      { k: 'page', t: `${code} full-length exam paper`, s: `Real timing: ${minutesLabel(u.data['exam-duration'])}`, h: `/${u.id}/quiz?mode=paper`, u: u.id },
      { k: 'page', t: `${code} quiz`, s: 'Adaptive quiz', h: `/${u.id}/quiz`, u: u.id },
      { k: 'page', t: `${code} cards`, s: 'Flashcards', h: `/${u.id}/cards`, u: u.id },
      { k: 'page', t: `${code} question bank`, s: 'Browse and re-test', h: `/${u.id}/questions`, u: u.id },
      { k: 'page', t: `${code} error log`, s: 'Wrong answers by concept', h: `/${u.id}/errors`, u: u.id },
    );
    for (const w of await weeksOf(u.id))
      items.push({ k: 'week', t: w.data.topic, s: `${code} week ${w.data.number}`, h: `/${u.id}/week/${w.data.number}`, u: u.id, w: w.data.number });
    const concepts = await conceptsOf(u.id);
    const weekNo = new Map(concepts.map((c) => [c.id, Number(c.data.week?.match(/w(\d+)$/)?.[1] ?? 0) || undefined]));
    for (const c of concepts)
      items.push({ k: 'concept', t: c.data.title, s: code, h: `/${u.id}/concept/${conceptSlug(c)}`, u: u.id, w: weekNo.get(c.id) });
    for (const q of await questionsOf(u.id)) {
      const d = q.data as Record<string, any>;
      const text = String(d.stem ?? d.statement ?? d.prompt ?? '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      items.push({ k: 'question', t: text.length > 140 ? `${text.slice(0, 139)}…` : text, s: `${code} · ${d.type}`, h: `/${u.id}/quiz?mode=set`, u: u.id, w: weekNo.get(d.concept), id: q.id });
    }
  }
  for (const k of await getCollection('cases'))
    items.push({ k: 'case', t: k.data.name, s: k.data.citation, h: `/cases/${k.id}`, u: k.data.units?.find((x: string) => unitIds.has(x)) });
  for (const a of await getCollection('authorities'))
    items.push({ k: 'authority', t: a.data.title, s: a.data.kind, h: `/authorities/${a.id}`, u: a.data.units?.find((x: string) => unitIds.has(x)) });
  return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json' } });
};
