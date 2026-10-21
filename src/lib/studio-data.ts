import {getCollection} from 'astro:content';
import {getLibrary} from './rebuild';
import {conceptSlug} from './content';
import {isTortsExamConcept} from './study-studio';
export async function getStudioData(unit:string) {
 const [library,cs,as,qs,fs]=await Promise.all([getLibrary(),getCollection('concepts',c=>c.data.unit===unit),getCollection('aids',a=>a.data.unit===unit),getCollection('questions'),getCollection('facts',f=>f.data.unit===unit)]);
 const byConcept=new Map(cs.map(c=>[c.id,c]));
 const listed=new Set(library.filter(r=>r.listed).map(r=>r.id));
 const questions=qs.filter(q=>byConcept.has(q.data.concept)&&['short','long'].includes(q.data.type)).map(q=>{
  const c=byConcept.get(q.data.concept)!;const d=q.data as any;
  const eligible=unit!=='laws2400'||(isTortsExamConcept(c.data.title,+c.data.week.split('-w')[1])&&d.cases.every((r:string)=>listed.has(r))&&c.data.authorities.every(r=>listed.has(r)));
  return {id:q.id,...d,title:c.data.title,unit,examEligible:eligible,href:`/${unit}/quiz?question=${q.id}`};
 });
 return {unit,library:library.filter(r=>r.units.includes(unit)),aids:as.map(a=>({id:a.id,...a.data,title:byConcept.get(a.data.concept)?.data.title||a.data.concept,href:`/${unit}/concept/${byConcept.get(a.data.concept)?conceptSlug(byConcept.get(a.data.concept)!):a.data.concept}/`})),questions,facts:fs.map(f=>({id:f.id,...f.data,questionData:questions.find(q=>q.id===f.data.question)})).filter(f=>f.questionData)};
}
