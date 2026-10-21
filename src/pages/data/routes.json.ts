// Every page route, for Settings → "Save for offline" (fills the service worker's page cache).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {getJumpIndex} from '../../lib/rebuild';
import { units, weeksOf, conceptsOf, conceptSlug } from '../../lib/content';

export const GET: APIRoute = async () => {
  const r: string[] = ['/', '/dashboard/', '/plan/', '/map/', '/settings/', '/cards/', '/exam/', '/search/', '/offline/', '/glossary/', '/cases/', '/insight/', '/statutes/'];
  r.push(...(await getJumpIndex()).map(x=>x.href.split('?')[0]));
  const data: string[] = ['/data/overview.json', '/data/search-index.json', '/data/mentions.json', '/data/everything.json', '/data/studio/laws2400.json', '/data/studio/laws2000.json', '/data/studio/laws2100.json', '/data/studio/mgmt2094.json'];
  for (const u of await units()) {
    r.push(`/${u.id}/`, `/${u.id}/quiz/`, `/${u.id}/cards/`, `/${u.id}/questions/`, `/${u.id}/errors/`);
    data.push(`/data/${u.id}/questions.json`, `/data/${u.id}/cards.json`);
    r.push(`/${u.id}/flows/`, `/${u.id}/problems/`, `/${u.id}/sheet/`, `/${u.id}/visual/`, `/${u.id}/listen/`, `/${u.id}/argue/`, `/${u.id}/case-anatomy/`);
    data.push(`/data/${u.id}/aids.json`);
    for (const w of await weeksOf(u.id)) r.push(`/${u.id}/week/${w.data.number}/`, `/${u.id}/week/${w.data.number}/sheet/`);
    for (const f of await getCollection('flows', (x) => x.data.unit === u.id)) r.push(`/${u.id}/flow/${f.id.replace(`${u.id}-`, '')}/`);
    for (const f of await getCollection('facts', (x) => x.data.unit === u.id)) r.push(`/${u.id}/problem/${f.id.replace(`${u.id}-`, '')}/`);
    for (const c of await conceptsOf(u.id)) r.push(`/${u.id}/concept/${conceptSlug(c)}/`);
  }
  for (const k of await getCollection('cases')) r.push(`/cases/${k.id}/`);
  for (const a of await getCollection('authorities')) r.push(`/authorities/${a.id}/`);
  return new Response(JSON.stringify({ pages: [...new Set(r)], data }), { headers: { 'content-type': 'application/json' } });
};
