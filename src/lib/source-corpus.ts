// Build-time access to literal extracted sources; never interpret their contents as markup.
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
export interface SourceOriginal {id?: string; path?: string; title?: string; url?: string; href?: string}
export interface SourceSection {id: string; label: string; text: string; method?: string; origin?: string; imageUrl?: string; ocr?: {meanConfidence?: number | null}; warnings?: string[]}
export interface OriginalDownloadSpec {filename:string;bytes:number;sha256?:string|null;url?:string;parts?:Array<{url:string;bytes?:number;sha256?:string|null}>}
export interface SourceRecord {
 id: string; sha256: string | null; title: string; paths: string[]; unit: string; week?: number | string | null;
 bytes?: number; format?: string; sections?: SourceSection[]; sectionCount?: number; characters?: number;
 warnings: string[]; originals: SourceOriginal[]; dataUrl?: string; extractionStatus?: string; originalDownload?:OriginalDownloadSpec;
}
export interface SourceIndex {files: SourceRecord[]; summary?: Record<string, any>; missing?: any[]}
const root=join(process.cwd(),'public/source-corpus');
let cached:SourceIndex;
export function sourceIndex():SourceIndex {
 if(cached)return cached;
 const path=join(root,'index.json');
 if(!existsSync(path))return {files:[],summary:{ready:false}};
 const raw=JSON.parse(readFileSync(path,'utf8'));
 return cached={...raw,files:(raw.files||[]).map((r:any)=>({...r,title:r.title||r.name||r.id,paths:r.paths||[r.path||''],unit:r.unit||'shared',warnings:r.warnings||[],originals:r.originals||[],sectionCount:r.sectionCount??r.sections?.length??0}))};
}
export function sourceFile(id:string):SourceRecord {
 if(!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Invalid source identifier');
 const meta=sourceIndex().files.find(f=>f.id===id);
 if(!meta)throw new Error(`Unknown source: ${id}`);
 const record={...meta,...JSON.parse(readFileSync(join(root,'files',`${id}.json`),'utf8'))};
 return {...record,unit:record.unit||'shared',paths:record.paths||[],warnings:record.warnings||[],originals:record.originals||[]};
}
export const sourceHref=(id:string)=>`/sources/${id}/`;
export function sourceWeek(r:SourceRecord):number|null {
 if(typeof r.week==='number')return r.week;
 const m=String(r.week||'').match(/(?:-w)?(\d+)$/);return m?Number(m[1]):null;
}
export function sourceStats(){const index=sourceIndex();return {...index.summary,files:index.files.length,characters:index.files.reduce((n,f)=>n+(f.characters||0),0),sections:index.files.reduce((n,f)=>n+(f.sectionCount||0),0),flaggedFiles:index.files.filter(f=>f.warnings.length>0).length};}
