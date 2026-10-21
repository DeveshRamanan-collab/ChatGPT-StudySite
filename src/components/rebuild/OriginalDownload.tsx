import {useRef,useState} from 'react';
export interface OriginalDownloadSpec {
 filename:string;bytes:number;sha256?:string|null;url?:string;
 parts?:Array<{url:string;bytes?:number;sha256?:string|null}>;
}
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
async function digest(bytes:ArrayBuffer){return crypto.subtle?hex(await crypto.subtle.digest('SHA-256',bytes)):null;}
export default function OriginalDownload({download}:{download:OriginalDownloadSpec}) {
 const [busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState('');
 const attempt=useRef(0);
 const chunks=download.parts||[];
 async function assemble(){
  const current=++attempt.current;setBusy(true);setError('');setStatus('Preparing original file…');
  const buffers:ArrayBuffer[]=new Array(chunks.length),controller=new AbortController();let next=0,done=0,received=0;
  try{
   await Promise.all(Array.from({length:Math.min(2,chunks.length)},async()=>{
    while(next<chunks.length&&attempt.current===current){const at=next++,part=chunks[at];const response=await fetch(part.url,{signal:controller.signal});if(!response.ok)throw new Error(`Part ${at+1} could not be downloaded (${response.status}).`);const bytes=await response.arrayBuffer();
     if(part.bytes!==undefined&&bytes.byteLength!==part.bytes)throw new Error(`Part ${at+1} has an unexpected size.`);
     if(part.sha256){const sha=await digest(bytes);if(sha&&sha!==part.sha256.toLowerCase())throw new Error(`Part ${at+1} failed its checksum.`);}
     buffers[at]=bytes;received+=bytes.byteLength;done++;if(attempt.current===current)setStatus(`Downloaded ${done} of ${chunks.length} parts · ${(received/1048576).toFixed(1)} MB`);
    }
   }));
   if(received!==download.bytes)throw new Error('The assembled original has an unexpected size.');
   setStatus('Checking the assembled original…');
   const blob=new Blob(buffers,{type:'application/octet-stream'});buffers.length=0;
   let verified=false;
   if(download.sha256){const sha=await digest(await blob.arrayBuffer());if(sha&&sha!==download.sha256.toLowerCase())throw new Error('The assembled original failed its SHA-256 checksum.');verified=!!sha;}
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=download.filename;link.hidden=true;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
   setStatus(verified?'Original downloaded. Its size and SHA-256 match the retained file.':'Original downloaded. Its byte count matches; this browser did not verify the SHA-256.');
  }catch(e){controller.abort();attempt.current++;setError(e instanceof Error?e.message:'The original could not be downloaded. Please retry.');setStatus('');}finally{setBusy(false);}
 }
 if(chunks.length<=1){const url=download.url||chunks[0]?.url;return url?<p><a href={url} download={download.filename}>Download original file · {(download.bytes/1048576).toFixed(1)} MB</a></p>:null;}
 return <div className="original-download"><p><button type="button" disabled={busy} onClick={()=>void assemble()}>{busy?'Preparing original…':`Download original file · ${(download.bytes/1048576).toFixed(1)} MB`}</button></p><p className="rb-muted">The original is stored in {chunks.length} parts. This button joins and checks them before saving {download.filename}.</p><p role="status" aria-live="polite">{status}</p>{error&&<p role="alert">{error} No assembled download was saved.</p>}<details><summary>Individual original-file parts</summary><ol>{chunks.map((p,i)=><li key={p.url}><a href={p.url} download>Part {i+1}</a>{p.sha256&&<span style={{overflowWrap:'anywhere'}}> · SHA-256 {p.sha256}</span>}</li>)}</ol></details></div>;
}
