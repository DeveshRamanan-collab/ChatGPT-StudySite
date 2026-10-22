// Static build adapter. It preserves all original records and layers source-audited dossiers over them.
import { getCollection } from 'astro:content';
import { readFileSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { conceptSlug } from './content';
import {FEATURES} from './study-studio';
import { parseTitle } from './legal';
import { sourceHref, sourceIndex, sourceWeek } from './source-corpus';
import { FIRST_LINE, unique, type LibraryItem, type JumpItem } from './rebuild-types';

const read = (name: string, key: string): any[] => {
  const p = `src/data/rebuild/${name}.json`;
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8'))[key] || [] : [];
};
const arr = (v: any): string[] => Array.isArray(v) ? v.map((x) => typeof x === 'string' ? x : x.text || x.label || JSON.stringify(x)).filter(Boolean) : typeof v === 'string' && v ? [v] : [];
const text = (v: any): string => typeof v === 'string' ? v : arr(v).join('\n\n');
const vocab = yaml.load(readFileSync('content-src/dossiers/vocab.yaml', 'utf8')) as any;
let library: Promise<LibraryItem[]>;
export function getLibrary(): Promise<LibraryItem[]> {
  return library ||= (async () => {
    const [cases, authorities, concepts, dossiers] = await Promise.all([getCollection('cases'), getCollection('authorities'), getCollection('concepts'), getCollection('dossiers')]);
    const extraCases = [...read('case-details-a', 'cases'), ...read('case-details-b', 'cases'), ...read('other-case-details', 'cases')];
    const extraProvs = read('provision-details', 'provisions');
    const lc = vocab.lists['laws2400-examinable'].cases as any[];
    const lp = vocab.lists['laws2400-examinable'].provisions as any[];
    const existingCases = new Map(cases.map((c) => [c.id, c]));
    const records: LibraryItem[] = [];
    const add = (id: string, kind: 'case' | 'provision', d: any, p: any = {}) => {
      const gold = dossiers.find((x) => x.data.ref === id)?.data as any;
      p = { ...(gold || {}), ...p };
      const matching = kind === 'case' ? lc.find((x) => x.ref === id || x.also?.includes(id)) : lp.find((x) => x.ref === id);
      const linked = concepts.filter((c) => (kind === 'case' ? c.data.cases : c.data.authorities).includes(id));
      const units = unique([...(d.units || []), ...(p.units || []), ...linked.map((c) => c.data.unit), ...(matching ? ['laws2400'] : [])]);
      const weeks = unique([...linked.map((c) => c.data.week), ...arr(p.weeks).map((w) => /^\d+$/.test(w) ? `${units[0]}-w${w.padStart(2, '0')}` : w)]);
      const topics = unique([...arr(p.topics).map((t) => vocab.topics[units[0]]?.[t]?.label || t), ...linked.map((c) => c.data.title)]);
      const title = kind === 'case' ? p.name || d.name || matching?.as || id : p.act ? `${p.act} — ${p.sourceLine}` : d.title || matching?.as || id;
      const citation = p.citation || d.citation || '';
      const originals = kind === 'case' ? ['facts','issue','held','ratio','significance','why-here'].filter((k) => d[k]).map((k) => ({ label: k, text: d[k] })) : [{ label: 'Original provision text', text: d.text || '' }, { label: 'Original explanation', text: d.gloss || '' }].filter((x) => x.text);
      for(const t of p.teachingRecords || []) if(t && typeof t === 'object') originals.push({label:`Preserved teaching source · ${t.source || t.path || 'course material'}`,text:Object.entries(t).map(([key,value])=>`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`).join('\n\n')});
      records.push({
        id, kind, title, citation, href: kind === 'case' ? `/cases/${id}/` : `/authorities/${id}/`, units, weeks, topics,
        court: p.court || citation.match(/\b(HCA|NSWCA|NSWSC|FCA|UKHL|UKSC|ICJ|PCIJ|EWCA)\b/)?.[1] || (kind === 'case' ? 'See citation' : parseTitle(d.title || title).instrument),
        year: p.year || +(citation.match(/\b(1[5-9]\d\d|20\d\d)\b/)?.[1] || 0) || null,
        listed: !!matching, listNumber: matching ? (kind === 'case' ? matching.n || p.listNumber : lp.indexOf(matching) + 1) : p.listNumber, listScope: matching?.as || p.sourceLine,
        oneLine: p.oneLine || p['one-liner'] || FIRST_LINE(kind === 'case' ? d.ratio || d.held : d.gloss) || 'Open the source record.',
        plain: p.plain || (kind === 'case' ? d.facts : d.gloss) || '',
        concrete: p.concreteExplanation || p.analogy || (kind === 'case' ? d.significance || d['why-here'] : d.gloss) || '',
        facts: arr(p.keyFacts || p['key-facts'] || d.facts), issue: text(p.issue || p.issues || d.issue),
        reasoning: arr(p.reasoning), outcome: text(p.outcome || d.held), rule: text(p.ratio || d.ratio || d.gloss),
        text: kind === 'provision' ? text(p.text || d.text) : '',
        limits: arr(p.limits), conditions: arr(p.conditions || p.elements), exceptions: arr(p.exceptions),
        pitfalls: arr(p.pitfalls || p['exam-use']?.pitfalls), examUse: text(p.examUse || p['exam-use']?.when || d['why-here'] || d.significance),
        sourceNotes: arr(p.sourceNotes), sources: unique([...(Array.isArray(p.sources)?p.sources.map((s:any)=>typeof s==='string'?s:s.url||s.path||s.label).filter(Boolean):arr(p.sources)), ...arr(p.teachingRecords).filter((s) => s.startsWith('content-src/'))]),
        verification: p.verification || (p.verify === false ? 'teaching-source' : d.verify ? 'unresolved' : 'teaching-source'),
        verificationNote: p.verificationNote || p['verify-notes'] || (d.verify ? 'The original source record is flagged for checking. Read the linked material before relying on an uncertain detail.' : 'From the supplied teaching materials. A teaching summary is not a full judgment.'),
        originals, related: unique(linked.flatMap((c) => [...c.data.cases, ...c.data.authorities]).filter((x) => x !== id)),
      });
    };
    for (const c of cases) add(c.id, 'case', c.data, extraCases.find((p) => p.ref === c.id));
    for (const p of extraCases) if (!existingCases.has(p.ref)) add(p.ref, 'case', { units: ['laws2400'] }, p);
    const provIds = new Set(authorities.map((a) => a.id));
    for (const a of authorities) add(a.id, 'provision', a.data, extraProvs.find((p) => p.ref === a.id));
    for (const p of extraProvs) if (!provIds.has(p.ref)) add(p.ref, 'provision', { units: ['laws2400'] }, p);
    // A listed authority is always visible even if its factual dossier still requires source verification.
    for (const x of lc) if (!records.some((r) => r.kind === 'case' && r.id === x.ref)) add(x.ref, 'case', { name: x.as, units: ['laws2400'], verify: true });
    for (const x of lp) if (!records.some((r) => r.kind === 'provision' && r.id === x.ref)) add(x.ref, 'provision', { title: x.as, units: ['laws2400'], verify: true });
    return records.sort((a,b) => a.title.localeCompare(b.title));
  })();
}

export async function getJumpIndex(): Promise<JumpItem[]> {
  const [us, weeks, concepts, flows, facts, library] = await Promise.all([getCollection('units'), getCollection('weeks'), getCollection('concepts'), getCollection('flows'), getCollection('facts'), getLibrary()]);
  const out: JumpItem[] = [
    ...[['Home','/'],['Exam command centre','/exams/'],['Learning studio','/studio/'],['Study plan','/plan/'],['Dashboard','/dashboard/'],['Cases','/cases/'],['Legislation and treaties','/statutes/'],['Everything index','/everything/'],['Original sources','/sources/'],['Coverage audit','/coverage/'],['Knowledge map','/map/'],['All-unit exam practice','/exam/'],['Due cards','/cards/'],['Glossary','/glossary/'],['Compare','/compare/'],['Learning insight','/insight/'],['Image occlusion','/occlusion/'],['Content health','/content-health/'],['Settings','/settings/'],['Search','/search/'],['Offline','/offline/'],['Style guide','/styleguide/']].map(([title,href]) => ({ title, href, kind:'Page',unit:'' })),
  ];
  for (const [id,title,description] of FEATURES) out.push({title,description,href:`/studio/?tool=${id}`,kind:'Learning tool',unit:''});
  const tools = [['Hub',''],['Exam','exam'],['Quiz','quiz'],['Question bank','questions'],['Flashcards','cards'],['Error log','errors'],['Decision flows','flows'],['Problem questions','problems'],['Revision sheet','sheet'],['Visual map','visual'],['Listen and viva','listen'],['Arguments','argue'],['Case anatomy','case-anatomy']];
  for (const u of us) for (const [title,path] of tools) out.push({ title:`${u.data.code} · ${title}`,href:`/${u.id}/${path ? path+'/' : ''}`,unit:u.id,kind:'Unit tool' });
  for (const w of weeks) { out.push({ title:`${w.data.unit.toUpperCase()} · Week ${w.data.number} · ${w.data.topic}`,href:`/${w.data.unit}/week/${w.data.number}/`,unit:w.data.unit,week:w.data.number,kind:'Week',description:w.data.summary }); out.push({title:`${w.data.unit.toUpperCase()} · Week ${w.data.number} revision sheet`,href:`/${w.data.unit}/week/${w.data.number}/sheet/`,unit:w.data.unit,week:w.data.number,kind:'Sheet'}); }
  for (const c of concepts) out.push({ title:c.data.title,href:`/${c.data.unit}/concept/${conceptSlug(c)}/`,unit:c.data.unit,kind:'Topic',week:+c.data.week.split('-w')[1] });
  for (const f of flows) out.push({title:f.data.title,href:`/${f.data.unit}/flow/${f.id.replace(`${f.data.unit}-`,'')}/`,unit:f.data.unit,kind:'Flow'});
  for (const f of facts) out.push({title:f.id,href:`/${f.data.unit}/problem/${f.id.replace(`${f.data.unit}-`,'')}/`,unit:f.data.unit,kind:'Problem'});
  for (const r of library) out.push({title:r.title,href:r.href,kind:r.kind === 'case'?'Case':'Provision',unit:r.units[0] || '',description:r.oneLine});
  for (const source of sourceIndex().files) {
    const week = sourceWeek(source);
    const recording = source.extractionStatus === 'audiovisual-not-reviewed';
    out.push({
      title: source.title, href: sourceHref(source.id), unit: source.unit,
      kind: recording ? 'Recording · unreviewed' : 'Source',
      ...(week !== null ? {week} : {}),
      description: [recording ? 'Audiovisual review pending' : 'Original source material', source.format?.toUpperCase(), week !== null ? `Week ${week}` : '', ...source.paths].filter(Boolean).join(' · '),
    });
  }
  return out;
}
