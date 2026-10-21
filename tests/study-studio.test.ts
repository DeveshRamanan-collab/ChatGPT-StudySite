import {describe,it,expect} from 'vitest';
import {calendarSlots,timeBudget,citationHints,passageScore,isTortsExamConcept} from '../src/lib/study-studio';
import calendar from '../src/data/rebuild/calendar.json';
import exam from '../src/data/rebuild/exam-info.json';
import a from '../src/data/rebuild/case-details-a.json';
import b from '../src/data/rebuild/case-details-b.json';
import p from '../src/data/rebuild/provision-details.json';
import {readFileSync} from 'node:fs';
import yaml from 'js-yaml';
describe('exam source integrity',()=>{
 const vocab=yaml.load(readFileSync('content-src/dossiers/vocab.yaml','utf8')) as any;
 const list=vocab.lists['laws2400-examinable'];
 it('retains every numbered case and both independent explanations',()=>{const cases=[...a.cases,...b.cases];expect(cases).toHaveLength(77);expect(cases.map(c=>c.listNumber).sort((a,b)=>a-b)).toEqual(Array.from({length:77},(_,i)=>i+1));for(const c of cases){expect(list.cases.some((x:any)=>x.ref===c.ref)).toBe(true);expect(c.plain.length).toBeGreaterThan(40);expect(c.concreteExplanation.length).toBeGreaterThan(40);expect(c.plain).not.toBe(c.concreteExplanation);expect(c.sources.length).toBeGreaterThan(0);expect(c.verificationNote.length).toBeGreaterThan(10);}});
 it('retains all 45 operative provision entries with scope and limits',()=>{expect(p.provisions).toHaveLength(45);expect(p.provisions.map(p=>p.ref)).toEqual(list.provisions.map((x:any)=>x.ref));for(const x of p.provisions){expect(x.textComplete).toBe(true);expect(x.text.length).toBeGreaterThan(40);expect(x.plain).not.toBe(x.concreteExplanation);expect(x.verificationNote.length).toBeGreaterThan(5);}});
 it('keeps confirmed PIL and unconfirmed Torts allowance distinct',()=>{expect(exam.exams.find(e=>e.unit==='laws2000')!.materials.universityNotesAllowanceVerified).toBe(true);expect(exam.exams.find(e=>e.unit==='laws2400')!.materials.universityNotesAllowanceVerified).toBe(false);expect(exam.exams.find(e=>e.unit==='laws2100')!.questions).toHaveLength(0);});
 it('allocates published PIL weights without rounding away a half minute',()=>expect(timeBudget(150,[40,30,15,15])).toEqual([60,45,22.5,22.5]));
 it('flags missing pinpoints and the actual PIL citation conflict',()=>{expect(citationHints('laws2000','UN Charter','treaty').join(' ')).toContain('article pinpoint');expect(citationHints('laws2000','Nicaragua v United States','case').join(' ')).toContain('sources conflict');});
 it('does not infer examinability from an intentional tort label',()=>{expect(isTortsExamConcept('Battery',5)).toBe(false);expect(isTortsExamConcept('Duty of care',5)).toBe(true);expect(isTortsExamConcept('Duty of care',2)).toBe(false);});
 it('retrieves passages from the requested issue rather than arbitrary text',()=>expect(passageScore('obvious risk defence','The defendant relies on an obvious risk.')).toBeGreaterThan(passageScore('obvious risk defence','Treaty reservations and consent.')));
});
describe('preferred calendar blocks',()=>{
 const slots=calendarSlots(calendar);
 it('preserves every protected block with no assigned task',()=>{expect(slots.filter((s:any)=>s.kind==='protected')).toHaveLength(12);expect(slots.filter((s:any)=>s.kind==='protected').every((s:any)=>s.title==='Protected Spare Time')).toBe(true);});
 it('retains exact start/end instants and Wednesday exception',()=>{for(const cal of calendar.calendars)for(const e of cal.events){expect(slots.find((s:any)=>s.id===e.id)).toMatchObject({start:e.start,end:e.end,kind:cal.kind});}const continuation=slots.find((s:any)=>/Week 6.*no repeat/.test(s.title));expect(continuation).toBeDefined();expect(continuation.repeat).toBe(false);expect(continuation.noRepeat).toBe(true);});
});
