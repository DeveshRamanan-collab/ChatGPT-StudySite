// Extracts plain text from raw materials into .cache/raw-text/ (gitignored) so ingestion reads text, not binaries.
// Handles .md/.txt (copied), .pdf (pdfjs-dist), .pptx (slides + speaker notes), .docx, .rtf (LibreOffice).
// Images are listed for reading directly. Usage: node scripts/extract.mjs <raw dir> [...more]
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { listFiles, sourceHash } from './source-hash.mjs';

const OUT = '.cache/raw-text';
const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');

function zipEntries(file) {
  return execFileSync('unzip', ['-Z1', file], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean);
}
const zipRead = (file, entry) => execFileSync('unzip', ['-p', file, entry], { encoding: 'utf8', maxBuffer: 1 << 28 });

/** Paragraph-preserving text from DrawingML/WordprocessingML: one line per <a:p>/<w:p>. */
function xmlParagraphs(xml, p, t) {
  const out = [];
  for (const para of xml.split(new RegExp(`</${p}>`))) {
    const runs = [...para.matchAll(new RegExp(`<${t}(?: [^>]*)?>([\\s\\S]*?)</${t}>`, 'g'))].map((m) => decode(m[1]));
    const line = runs.join('').trim();
    if (line) out.push(line);
  }
  return out.join('\n');
}

function pptx(file) {
  const entries = zipEntries(file);
  const num = (e) => +e.match(/(\d+)\.xml$/)[1];
  const slides = entries.filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e)).sort((a, b) => num(a) - num(b));
  return slides
    .map((s) => {
      const n = num(s);
      let text = `--- slide ${n} ---\n${xmlParagraphs(zipRead(file, s), 'a:p', 'a:t')}`;
      const notes = `ppt/notesSlides/notesSlide${n}.xml`;
      if (entries.includes(notes)) {
        const nt = xmlParagraphs(zipRead(file, notes), 'a:p', 'a:t').replace(/^\d+$/m, '').trim();
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

for (const dir of process.argv.slice(2)) {
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
