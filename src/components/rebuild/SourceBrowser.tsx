import {useEffect,useRef,useState} from 'react';
import {sourceMatchesQuery} from '../../lib/source-search';
interface Source {
 id?:string;title?:string;name?:string;path?:string;paths?:string[];unit?:string|null;week?:number|string|null;
 kind?:string;format?:string;bytes?:number;sha256?:string|null;href?:string;url?:string;dataUrl?:string;supplied?:boolean;
 warnings?:string[];sectionCount?:number;extractionStatus?:string;originals?:{url?:string;href?:string}[];
}
const paths=(s:Source)=>(s.paths||[s.path||'']).join('\n');
const name=(s:Source)=>s.title||s.name||s.path||'Source file';
const unitOf=(s:Source)=>s.unit||'shared';
const href=(s:Source)=>s.id?`/sources/${s.id}/`:s.supplied?'/exam-sources/'+encodeURIComponent(s.name||''):s.href||s.url||s.originals?.[0]?.url||'/sources/';
const includes=sourceMatchesQuery;
export default function SourceBrowser({catalog,missing=[]}:{catalog:Source[];missing?:Source[]}) {
 const [query,setQuery]=useState(''),[unit,setUnit]=useState('all'),[week,setWeek]=useState('all'),[scope,setScope]=useState('path'),[supplied,setSupplied]=useState(false),[limit,setLimit]=useState(40);
 const [matches,setMatches]=useState<Set<string>|null>(null),[progress,setProgress]=useState({done:0,total:0,loading:false,errors:0});
 const cache=useRef(new Map<string,string>()),run=useRef(0);
 useEffect(()=>{const p=new URLSearchParams(location.search);setQuery(p.get('q')||p.get('path')||'');if(p.get('unit'))setUnit(p.get('unit')!);if(p.get('week'))setWeek(p.get('week')!);if(p.get('scope')==='text')setScope('text');return()=>{run.current++;};},[]);
 const eligible=catalog.filter(s=>(unit==='all'||unitOf(s)===unit||unitOf(s)==='shared')&&(week==='all'||String(s.week)===week)&&(!supplied||s.supplied));
 const shown=eligible.filter(s=>scope==='text'&&matches?matches.has(s.id||paths(s)):includes(name(s)+'\n'+paths(s),query));
 const reset=()=>{run.current++;setMatches(null);setLimit(40);setProgress({done:0,total:0,loading:false,errors:0});};
 async function searchText(){
  if(!query.trim()){reset();return;}
  const current=++run.current,found=new Set<string>();let next=0,done=0,errors=0;
  setMatches(new Set());setLimit(40);setProgress({done:0,total:eligible.length,loading:true,errors:0});
  await Promise.all(Array.from({length:Math.min(6,eligible.length)},async()=>{
   while(next<eligible.length&&run.current===current){const source=eligible[next++],key=source.id||paths(source);let text=name(source)+'\n'+paths(source);
    try{if(source.id){let body=cache.current.get(source.id);if(body===undefined){const response=await fetch(source.dataUrl||`/source-corpus/files/${source.id}.json`);if(!response.ok)throw new Error('Source text unavailable');const data=await response.json();body=(data.sections||[]).map((s:{text:string})=>s.text).join('\n');cache.current.set(source.id,body!);}text+='\n'+body;}if(includes(text,query))found.add(key);}catch{errors++;}
    done++;if(run.current!==current)return;setProgress({done,total:eligible.length,loading:done<eligible.length,errors});setMatches(new Set(found));
   }
  }));
  if(run.current===current)setProgress({done,total:eligible.length,loading:false,errors});
 }
 return <section aria-label="Search original sources"><form onSubmit={e=>{e.preventDefault();if(scope==='text')void searchText();}}><div className="rb-filters">
  <label className="rb-field">Words, filename or source path<input type="search" value={query} onChange={e=>{reset();setQuery(e.target.value);}}/></label>
  <label className="rb-field">Unit<select value={unit} onChange={e=>{reset();setUnit(e.target.value);}}><option value="all">All units</option>{['laws2400','laws2000','laws2100','mgmt2094'].map(u=><option key={u} value={u}>{u.toUpperCase()}</option>)}</select></label>
  <label className="rb-field">Week<select value={week} onChange={e=>{reset();setWeek(e.target.value);}}><option value="all">Every week</option>{Array.from({length:13},(_,n)=><option key={n} value={String(n)}>{n===0?'Revision / assessment':`Week ${n}`}</option>)}</select></label>
  <label className="rb-field">Search in<select value={scope} onChange={e=>{reset();setScope(e.target.value);}}><option value="path">Filenames and paths</option><option value="text">Full extracted text</option></select></label>
  <label className="rb-check"><input type="checkbox" checked={supplied} onChange={e=>{reset();setSupplied(e.target.checked);}}/>Supplied exam files only</label>
 </div>{scope==='text'&&<p><button type="submit" disabled={progress.loading||!query.trim()}>{progress.loading?'Searching…':'Search source text'}</button> <span className="rb-muted">Loads the selected files when you search.</span></p>}</form>
 <p role="status" aria-live="polite">{progress.loading?`Searched ${progress.done} of ${progress.total} files. ${shown.length} matches so far.`:`${shown.length} source files match.`}{progress.errors>0&&` ${progress.errors} files could not be searched; open their original records.`}{scope==='text'&&matches===null&&query.trim()&&' Press Search source text to include file contents.'}</p>
 {shown.slice(0,limit).map(s=><details className="rb-note" key={s.id||paths(s)}><summary>{name(s)} · {unitOf(s).toUpperCase()} · {s.format||s.kind||'file'}</summary><p className="rb-preline">{paths(s)}</p><p>{(s.bytes||0).toLocaleString()} bytes{s.sectionCount!==undefined&&` · ${s.sectionCount.toLocaleString()} extracted sections`}</p>{s.sha256&&<p className="rb-muted" style={{overflowWrap:'anywhere'}}>SHA-256: {s.sha256}</p>}{(s.warnings?.length||0)>0&&<p className="rb-muted">This source has extraction qualifications. Read them beside its full text.</p>}<a href={href(s)}>{s.id?'Read full extracted source':s.supplied?'Download original supplied file':'Open original source'}</a></details>)}
 {shown.length>limit&&<button type="button" onClick={()=>setLimit(limit+40)}>Show 40 more</button>}
 {missing.length>0&&<details className="rb-note"><summary>{missing.length} inventoried files awaiting readable extraction</summary><p>These files stay visible in the inventory. They are not counted as fully extracted sources.</p><ul>{missing.map((s,i)=><li key={s.id||i}><a href={s.url||s.href||s.originals?.[0]?.url||'#'}>{name(s)}</a> · {paths(s)}</li>)}</ul></details>}
 </section>;
}
