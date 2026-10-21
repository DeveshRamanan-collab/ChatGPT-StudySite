// Reproducible source-preservation and exam-list audit. No network or content rewriting.
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import yaml from 'js-yaml';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const original=read('docs/audits/original-files.json'),failures=[],changes=[],knownSourceGaps=[];
const gitSha=b=>createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
let content=0,raw=0;
for(const f of original.files){if(!existsSync(f.path)){failures.push(`Missing original: ${f.path}`);continue;}const sha=gitSha(readFileSync(f.path));if(/^src\/content\//.test(f.path))content++;if(/^raw\//.test(f.path))raw++;if(sha!==f.sha){if(/^(src\/content|content-src|raw|public\/fonts)\//.test(f.path))failures.push(`Changed retained source: ${f.path}`);else changes.push(f.path);}}
const cases=[...read('src/data/rebuild/case-details-a.json').cases,...read('src/data/rebuild/case-details-b.json').cases],provisions=read('src/data/rebuild/provision-details.json').provisions;
const list=yaml.load(readFileSync('content-src/dossiers/vocab.yaml','utf8')).lists['laws2400-examinable'];
if(cases.length!==77||new Set(cases.map(c=>c.ref)).size!==77)failures.push('Case count/uniqueness is not77');
for(const c of list.cases){const r=cases.find(x=>x.ref===c.ref);if(!r)failures.push(`Missing listed case: ${c.ref}`);else for(const k of ['oneLine','plain','concreteExplanation','keyFacts','issue','reasoning','outcome','ratio','limits','examUse','pitfalls','sources','verificationNote'])if(!r[k]||(Array.isArray(r[k])&&!r[k].length)){if(r.verification==='unresolved'&&r.verificationNote?.length>20)knownSourceGaps.push(`Case ${c.ref}: source does not establish ${k}`);else failures.push(`Case ${c.ref}: empty ${k}`);}}
if(provisions.length!==45)failures.push('Provision count is not45');
for(const p of list.provisions){const r=provisions.find(x=>x.ref===p.ref);if(!r||!r.textComplete||!r.text||!r.plain||!r.concreteExplanation)failures.push(`Incomplete provision: ${p.ref}`);}
const exam=read('src/data/rebuild/exam-info.json');const supplied=exam.sourceRegistry.filter(s=>s.id.startsWith('supplied-'));
if(supplied.length!==11)failures.push('Supplied original count is not11');
for(const s of supplied){if(!existsSync(s.path)){failures.push(`Missing supplied original: ${s.path}`);continue;}const hash=createHash('sha256').update(readFileSync(s.path)).digest('hex');if(hash!==s.sha256)failures.push(`Supplied checksum mismatch: ${s.filename}`);const pub=`public/exam-sources/${s.filename}`;if(!existsSync(pub)||!readFileSync(pub).equals(readFileSync(s.path)))failures.push(`Download does not match supplied original: ${s.filename}`);}
const cal=read('src/data/rebuild/calendar.json');const study=cal.calendars.find(c=>c.kind==='study').events.length,protectedCount=cal.calendars.find(c=>c.kind==='protected').events.length;
if(study!==56||protectedCount!==12||cal.calendarChanged||cal.liveSync)failures.push('Calendar snapshot contract changed');
const stats={sourceCommit:original.commit,originalFiles:original.files.length,originalContentExact:content,originalRawFilesExact:raw,cases:cases.length,caseVerification:Object.fromEntries(['primary-verified','teaching-source','unresolved'].map(v=>[v,cases.filter(c=>c.verification===v).length])),provisionEntries:provisions.length,completeOperativeTexts:provisions.filter(p=>p.textComplete).length,suppliedOriginals:supplied.length,studyBlocks:study,protectedBlocks:protectedCount,intentionallyModifiedOriginalCode:changes,knownSourceGaps,failures};
writeFileSync('reports/rebuild-source-audit.json',JSON.stringify(stats,null,2)+'\n');console.log(JSON.stringify(stats,null,2));if(failures.length)process.exit(1);
