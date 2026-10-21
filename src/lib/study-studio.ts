// Pure study helpers: no fabricated legal outcomes or marks.
export const FEATURES = [
 ['exam','Exam command centre','Published format, materials, scope and revision notes.'],
 ['notes','Ten-sheet composer','Compose, measure and print twenty A4 sides with overflow checks.'],
 ['mock','Paper practice','Timed papers using the published structure, with unknown settings made explicit.'],
 ['lens','Examiner lens','Compare an answer with the actual rubric and record evidence.'],
 ['citation','Citation coach','Check citation components against the unit’s published instructions.'],
 ['lock','Law-list lock','An exact filter for the supplied Torts case and provision list.'],
 ['theatre','Case theatre','Walk the facts, issue, reasoning and result as a visual story.'],
 ['statute','Statute lab','Read the full provision, test conditions and inspect exceptions.'],
 ['forge','Problem forge','Explore authored changes to a problem and predict their effect.'],
 ['xray','Issue X-ray','Reveal annotated facts and the issues they activate.'],
 ['architect','Answer architect','Build an ordered ILAC or essay plan with a writing budget.'],
 ['pathways','Precedent pathways','Explore cases by time and shared topic, with limits kept visible.'],
 ['duel','Distinguish duel','Compare the legally material facts of two real cases.'],
 ['forecast','Readiness map','Track evidence of recall and application without predicted grades.'],
 ['calendar','Calendar now','Use the preferred study blocks and keep reserve time unassigned.'],
 ['index','Everything index','Jump straight to every week, topic, case and course tool.'],
 ['ask','Ask the library','Retrieve source passages locally, with links back to each record.'],
 ['day','Exam-day preparation','A unit-specific materials and logistics checklist.'],
 ['gems','Hidden-gem trainer','Separate essential facts from background using authored annotations.'],
 ['tutor','Recall tutor and viva','Explain an authority, reveal two explanations and log your confidence.'],
] as const;
export type FeatureId = typeof FEATURES[number][0];
export function terms(s: string) { return [...new Set((s.toLowerCase().match(/[a-z]{3,}/g)||[]).filter(w=>!['the','and','that','with','from','this','what','which','does','have','was','for','are','how','can','case','law'].includes(w)))]; }
export function passageScore(query: string,text: string) { const t=text.toLowerCase();return terms(query).reduce((s,w)=>s+(t.includes(w)?1:0),0); }
export function timeBudget(minutes:number,weights:number[]) {const sum=weights.reduce((a,b)=>a+b,0);return weights.map(w=>sum>0?minutes*w/sum:0);}
export function isTortsExamConcept(title:string,week:number) { return week>=5 && week<=12 && !/\b(battery|assault|false imprisonment|trespass to (?:person|land|goods)|intentional torts?)\b/i.test(title); }
export function citationHints(unit:string,answer:string,kind:'case'|'treaty'|'statute') {
 const hints:string[]=[];
 if(!answer.trim())return ['Enter your proposed citation to check its components.'];
 if(kind==='case'&& !/\bv\.?\s|\bCase\b|\bAdvisory Opinion\b/i.test(answer))hints.push('Check that the case is recognisable by its name, not just a proposition.');
 if(unit==='laws2000'&&kind==='case')hints.push('PIL sources conflict: the portal asks for the court and an abbreviated case name on first use; the cover sheet asks for the full case name. Prepare the full name and court; confirm the preferred form with the convenor.');
 if(kind==='treaty'&&!/\b(?:art(?:icle)?s?\.?|[Aa]rticles?)\s*\d+/.test(answer))hints.push('Add the relevant article pinpoint where a particular treaty rule is being used.');
 if(kind==='statute'&&!/\b(?:s|ss|section|sections)\.?\s*\d+/.test(answer))hints.push('Add the section and any relevant subsection.');
 if(unit==='laws2000'&&/\[\d+\]|\^\d/.test(answer))hints.push('PIL asks for in-text references, not footnotes.');
 hints.push('This checks visible components only. Compare the exact authority, proposition and pinpoint with the source.');return hints;
}
export function calendarSlots(snapshot:any) {return snapshot.calendars.flatMap((cal:any)=>cal.events.filter((e:any)=>e.status!=='cancelled').map((e:any)=>{
 const s=`${e.title} ${e.description||''}`; const unit=/Torts|LAWS2400/i.test(s)?'laws2400':/International|PIL|LAWS2000/i.test(s)?'laws2000':/Juris|LAWS2100/i.test(s)?'laws2100':/MGMT2094|Creativity|Marketing/i.test(s)?'mgmt2094':undefined;
 return {...e,unit,week:+(e.title.match(/Week\s*(\d+)/i)?.[1]||0)||undefined,kind:cal.kind,attempt:/Wednesday attempt/i.test(e.title),repeat:/full repeat/i.test(e.title),noRepeat:/no repeat/i.test(e.title)};
 })).sort((a:any,b:any)=>+new Date(a.start)-+new Date(b.start));}
