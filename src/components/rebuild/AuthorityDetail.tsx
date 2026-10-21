import { useState } from 'react';
import type { LibraryItem } from '../../lib/rebuild-types';
import '../../styles/rebuild.css';

export default function AuthorityDetail({ item: r, compact = false }: { item: LibraryItem; compact?: boolean }) {
  const [tab,setTab] = useState('visual');
  const [step,setStep] = useState(0);
  const [prediction,setPrediction] = useState('');
  const [reveal,setReveal] = useState(false);
  const [checks,setChecks] = useState<string[]>([]);
  const beats = r.kind === 'case'
    ? [{label:'What happened',text:r.facts.join('\n\n') || r.plain},{label:'The legal question',text:r.issue},{label:'The reasoning',text:r.reasoning.join('\n\n') || r.rule},{label:'The outcome',text:r.outcome}]
    : [{label:'The provision',text:r.text},{label:'When it applies',text:r.conditions.join('\n\n') || r.plain},{label:'Exceptions and limits',text:[...r.exceptions,...r.limits].join('\n\n')},{label:'Use it in an answer',text:r.examUse}];
  const sourceHref = (s:string) => s.match(/https?:\/\/[^\s)]+/)?.[0] || `/sources/?path=${encodeURIComponent(s)}`;
  return <section className="rb-detail" aria-label={`${r.title} explanation`}>
    {r.listed && <p className="rb-badge">Torts examinable list {r.listNumber ? `· entry ${r.listNumber}` : ''}<span>{r.listScope}</span></p>}
    <p className="rb-status" data-status={r.verification}>{r.verification.replace(/-/g,' ')} · {r.verificationNote}</p>
    <div className="rb-tabs" role="tablist" aria-label="Explanation view">{[['visual','Visual story'],['text','Full text'],['apply','Apply and recall'],['sources','Sources and limits']].map(([id,label])=><button key={id} role="tab" type="button" aria-selected={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==='visual' && <div className="rb-story" role="tabpanel">
      <ol className="rb-story-track">{beats.map((b,i)=><li key={b.label}><button type="button" aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}><span>{i+1}</span>{b.label}</button></li>)}</ol>
      <figure className="rb-story-figure"><svg viewBox="0 0 600 84" role="img" aria-label={`Stage ${step+1} of4: ${beats[step].label}`}><path d="M55 42H545" stroke="var(--line-strong,var(--ink-3))" strokeWidth="1"/>{beats.map((b,i)=><g key={b.label}><circle cx={55+i*163} cy="42" r={step===i?18:9} fill={step===i?'var(--accent)':'var(--paper-3)'} stroke="var(--ink-2)"/><text x={55+i*163} y="47" textAnchor="middle" fill={step===i?'var(--on-accent,#fff)':'var(--ink)'} fontSize="13">{i+1}</text></g>)}</svg><figcaption><strong>{beats[step].label}</strong><p className="rb-preline">{beats[step].text || 'This detail is not established in the available record. Open the sources and verification note.'}</p></figcaption></figure>
      <div className="rb-actions"><button type="button" disabled={!step} onClick={()=>setStep(step-1)}>Previous</button><span aria-live="polite">{step+1} of {beats.length}</span><button type="button" disabled={step===beats.length-1} onClick={()=>setStep(step+1)}>Next</button></div>
      <h3>In simple language</h3><p className="rb-preline">{r.plain || 'The available source does not yet establish a reliable plain-language explanation.'}</p>
      <h3>A second way to understand it</h3><p className="rb-preline">{r.concrete || r.examUse || 'Read the linked teaching material to complete this explanation.'}</p>
      {r.kind==='provision' && <p className="rb-muted">A checklist organises legal reasoning. Ticking a box does not decide a real claim.</p>}
    </div>}
    {tab==='text' && <div role="tabpanel">
      {r.kind==='case' ? <>{r.facts.length>0 && <><h3>Facts</h3><ul>{r.facts.map((f,i)=><li key={i}>{f}</li>)}</ul></>}<h3>Issue</h3><p>{r.issue || 'Not established in the available record.'}</p><h3>Reasoning</h3>{r.reasoning.length ? <ul>{r.reasoning.map((f,i)=><li key={i}>{f}</li>)}</ul>:<p>{r.rule}</p>}<h3>Outcome</h3><p>{r.outcome}</p><h3>Legal principle</h3><p>{r.rule}</p></>:<><h3>Operative text</h3><p className="rb-preline rb-statute-text">{r.text || 'Operative text remains unverified. The heading alone does not establish the rule.'}</p><h3>What it means</h3><p>{r.plain}</p></>}
      {r.sourceNotes?.length>0&&<><h3>Publisher notes · separate from operative text</h3>{r.sourceNotes.map((n,i)=><p key={i}>{n}</p>)}</>}<h3>Use in the exam</h3><p className="rb-preline">{r.examUse}</p>
      {r.originals.length>0 && <details><summary>Original teaching record · preserved for comparison</summary>{r.originals.map((f,i)=><div key={i}><h4>{f.label}</h4><p className="rb-preline">{f.text}</p></div>)}<p className="rb-muted">Where a verified dossier corrects an original summary, use the corrected explanation above.</p></details>}
    </div>}
    {tab==='apply' && <div role="tabpanel"><h3>{r.kind==='case'?'Pause and predict':'Check the statutory pathway'}</h3><p>{r.kind==='case'?r.issue:r.plain}</p>
      {r.kind==='provision' && <fieldset><legend>Record the conditions supported by the hypothetical</legend>{r.conditions.map((c,i)=><label className="rb-check" key={i}><input type="checkbox" checked={checks.includes(c)} onChange={()=>setChecks(checks.includes(c)?checks.filter(x=>x!==c):[...checks,c])}/>{c}</label>)}<p aria-live="polite">{checks.length} of {r.conditions.length} conditions considered. Consider the exceptions separately.</p></fieldset>}
      <label className="rb-field">Your explanation<textarea value={prediction} onChange={e=>setPrediction(e.target.value)} placeholder="State the issue, connect the facts to the rule, and give a qualified conclusion."/></label><button type="button" onClick={()=>setReveal(!reveal)} aria-expanded={reveal}>{reveal?'Hide':'Reveal'} the source explanation</button>{reveal&&<div className="rb-answer"><p className="rb-preline">{r.outcome || r.rule || r.examUse}</p><p className="rb-preline">{r.examUse}</p><p className="rb-muted">Compare your reasoning with the source. This is self-assessment, not automated grading.</p></div>}
      <p><a href={`/studio/?tool=tutor&item=${encodeURIComponent(r.id)}`}>Practise this authority with the recall tutor</a></p>
    </div>}
    {tab==='sources' && <div role="tabpanel"><p className="rb-status" data-status={r.verification}>{r.verification.replace(/-/g,' ')} · {r.verificationNote}</p>{[['Limits',r.limits],['Exceptions',r.exceptions],['Common mistakes',r.pitfalls]] .map(([label,items])=>(items as string[]).length>0&&<div key={label as string}><h3>{label as string}</h3><ul>{(items as string[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div>)}<h3>Source trail</h3>{r.sources.length?<ul>{r.sources.map((s,i)=><li key={i}><a href={sourceHref(s)}>{s}</a></li>)}</ul>:<p>Original teaching card and linked concept pages. Full source attribution remains under review.</p>}{!compact&&<p><a href="/coverage/">Open the coverage audit</a></p>}</div>}
  </section>;
}
