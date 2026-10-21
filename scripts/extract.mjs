// Extracts plain text from raw materials into .cache/raw-text/ (gitignored) so ingestion reads text, not binaries.
// Handles .md/.txt (copied), .pdf (pdfjs-dist), .pptx (slides + speaker notes), .docx, .rtf (LibreOffice).
// Images are listed for reading directly. Usage: node scripts/extract.mjs <raw dir> [...more]
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, basename, posix } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { listFiles, sourceHash } from './source-hash.mjs';

const OUT = '.cache/raw-text';
const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');

function zipEntries(file) {
  return execFileSync('unzip', ['-Z1', file], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean);
}
const zipRead = (file, entry) => execFileSync('unzip', ['-p', file, entry], { encoding: 'utf8', maxBuffer: 1 << 28 });

/** Paragraph-preserving text from DrawingML/WordprocessingML: one line per <a:p>/<w:p>. */
function xmlParagraphs(xml, p, t) {
  const out = [];
  const prefix=t.split(':')[0];
  for (const match of xml.matchAll(new RegExp(`<${p}(?:\\s[^>]*)?>([\\s\\S]*?)</${p}>`, 'g'))) {
    const tokens=[...match[1].matchAll(new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)</${t}>|<${prefix}:(br|tab)(?:\\s[^>]*)?\\s*/?>`,'g'))];
    out.push(tokens.map(m=>m[2]?(m[2]==='tab'?'\t':'\n'):decode(m[1])).join(''));
  }
  return out.join('\n');
}

export function pptx(file) {
  const entries = zipEntries(file);
  const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:.-]+)\s*=\s*(["'])(.*?)\2/g)].map(m=>[m[1],decode(m[3])]));
  const relationships=part=>{
    const rel=posix.join(posix.dirname(part),'_rels',posix.basename(part)+'.rels');
    if(!entries.includes(rel))return [];
    return [...zipRead(file,rel).matchAll(/<Relationship\b([^>]*?)\/?\s*>/g)].map(m=>attrs(m[1])).filter(a=>a.TargetMode!=='External').map(a=>({...a,target:a.Target.startsWith('/')?a.Target.slice(1):posix.normalize(posix.join(posix.dirname(part),a.Target))}));
  };
  const presentation=zipRead(file,'ppt/presentation.xml'), pr=relationships('ppt/presentation.xml');
  const slides=[...presentation.matchAll(/<p:sldId\b([^>]*?)\/?\s*>/g)].map(m=>pr.find(r=>r.Id===attrs(m[1])['r:id'])?.target).filter(Boolean);
  return slides
    .map((s,index) => {
      let text = `--- slide ${index+1} ---\n${xmlParagraphs(zipRead(file, s), 'a:p', 'a:t')}`;
      for(const notes of relationships(s).filter(r=>r.Type?.endsWith('/notesSlide')).map(r=>r.target)) {
        if(!entries.includes(notes))continue;
        const nt = xmlParagraphs(zipRead(file, notes), 'a:p', 'a:t');
        if (nt) text += `\n[speaker notes]\n${nt}`;
      }
      return text;
    })
    .join('\n\n');
}

const docx = (file) => xmlParagraphs(zipRead(file, 'word/document.xml'), 'w:p', 'w:t');

async function pdf(file) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    let line = '', lines = [], lastY = null;
    for (const it of c.items) {
      const y = it.transform?.[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) { lines.push(line); line = ''; }
      line += it.str;
      if (it.hasEOL) { lines.push(line); line = ''; }
      lastY = y;
    }
    lines.push(line);
    pages.push(`--- page ${i} ---\n${lines.map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')}`);
  }
  return pages.join('\n\n');
}

function rtf(file) {
  const dir = mkdtempSync(join(tmpdir(), 'rtf-'));
  execFileSync('soffice', ['--headless', '--convert-to', 'txt:Text', '--outdir', dir, file], { stdio: 'ignore', timeout: 120000 });
  const out = readdirSync(dir).find((f) => f.endsWith('.txt'));
  const text = out ? readFileSync(join(dir, out), 'utf8') : '';
  rmSync(dir, { recursive: true, force: true });
  return text;
}

async function extract(file) {
  const ext = extname(file).toLowerCase();
  if (ext === '.md' || ext === '.txt' || ext === '.yaml') return readFileSync(file, 'utf8');
  if (ext === '.pdf') return pdf(file);
  if (ext === '.pptx') return pptx(file);
  if (ext === '.docx') return docx(file);
  if (ext === '.rtf') return rtf(file);
  if (/\.(png|jpe?g|gif|webp)$/.test(ext)) return `[image — open ${file} with the Read tool to see it]`;
  return `[unsupported file type ${ext}]`;
}

async function main(args) {
for (const dir of args) {
  if (!existsSync(dir)) { console.error(`missing ${dir}`); process.exitCode = 1; continue; }
  console.log(`${dir}  source-hash ${sourceHash(dir)}`);
  for (const f of listFiles(dir)) {
    const out = join(OUT, relative('raw', f)) + '.txt';
    mkdirSync(dirname(out), { recursive: true });
    try {
      const text = await extract(f);
      writeFileSync(out, text);
      console.log(`  ${String(text.length).padStart(8)} chars  ${basename(f)}`);
    } catch (e) {
      console.log(`  FAILED ${basename(f)}: ${e.message}`);
      process.exitCode = 1;
    }
  }
}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)await main(process.argv.slice(2));
