// Turns the background renders (docs/plans/background-prompts.md) into what the site plays.
//   Scroll clips  bg-light.mp4 / bg-dark.mp4  → public/bg/<theme>/<width>/f-NNN.webp (an even sample of frames) + a
//                 poster, listed in public/bg/manifest.json. An image sequence drawn on a canvas scrubs smoothly in
//                 both directions at any speed; a <video> seeking between keyframes does not.
//   Intro film    intro-light.mp4 / intro-dark.mp4 → public/intro/<theme>-<height>.mp4 (H.264) and .webm (AV1),
//                 1080p / 1440p / 2160p, silent, faststart, plus first/last-frame posters.
// Usage: node scripts/bg-encode.mjs [sourceDir=~/Downloads/studysite-bg] [--frames 150] [--quality 58]
//        [--grade "eq=brightness=0.01:saturation=0.9"]   (an ffmpeg filter applied before scaling, optional)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, statSync, mkdtempSync, readFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const src = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) || join(homedir(), 'Downloads/studysite-bg');
const FRAMES = Number(opt('--frames', 150));
const Q = Number(opt('--quality', 58));
const GRADE = opt('--grade', '');
const WIDTHS = [960, 1600];
const OUT = 'public/bg';
const run = (cmd, a) => execFileSync(cmd, a, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }).toString();
const duration = (f) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).trim());
const kb = (p) => Math.round(statSync(p).size / 1024);

const manifest = existsSync(join(OUT, 'manifest.json')) ? JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8')) : {};

for (const theme of ['light', 'dark']) {
  const clip = join(src, `bg-${theme}.mp4`);
  if (!existsSync(clip)) { console.log(`skip scroll ${theme}: ${clip} not found`); continue; }
  const dur = duration(clip);
  const fps = FRAMES / dur;
  const sizes = {};
  for (const w of WIDTHS) {
    const dir = join(OUT, theme, String(w));
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const tmp = mkdtempSync(join(tmpdir(), 'bg-'));
    const vf = [GRADE, `fps=${fps.toFixed(5)}`, `scale=${w}:-2:flags=lanczos`].filter(Boolean).join(',');
    run('ffmpeg', ['-v', 'error', '-i', clip, '-vf', vf, '-frames:v', String(FRAMES), join(tmp, 'f-%03d.png')]);
    const pngs = readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();
    pngs.forEach((p, i) => run('cwebp', ['-quiet', '-q', String(Q), '-m', '6', '-sharp_yuv', join(tmp, p), '-o', join(dir, `f-${String(i).padStart(3, '0')}.webp`)]));
    rmSync(tmp, { recursive: true, force: true });
    const files = readdirSync(dir).filter((f) => f.endsWith('.webp'));
    const total = files.reduce((s, f) => s + kb(join(dir, f)), 0);
    sizes[w] = { frames: files.length, kb: total };
    console.log(`scroll ${theme} ${w}px: ${files.length} frames, ${total} KB`);
  }
  // Poster: the first frame at the larger size (shown on Motion: Calm and while frames load).
  execFileSync('cp', [join(OUT, theme, String(WIDTHS.at(-1)), 'f-000.webp'), join(OUT, `${theme}-poster.webp`)]);
  manifest[theme] = { frames: Math.min(...Object.values(sizes).map((s) => s.frames)), widths: WIDTHS, sizes, poster: `/bg/${theme}-poster.webp`, source: `bg-${theme}.mp4`, duration: dur };
}
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify({ ...manifest, 'generated-at': new Date().toISOString() }, null, 2));

// Intro film.
const intro = {};
for (const theme of ['light', 'dark']) {
  const film = join(src, `intro-${theme}.mp4`);
  if (!existsSync(film)) { console.log(`skip intro ${theme}: ${film} not found`); continue; }
  mkdirSync('public/intro', { recursive: true });
  const out = {};
  // Never upscale: a 1080p render is encoded at 1080p only.
  const srcH = Number(run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height', '-of', 'csv=p=0', film]).trim());
  const heights = [1080, 1440, 2160].filter((h) => h <= Math.max(1080, srcH));
  for (const h of heights) {
    const base = join('public/intro', `${theme}-${h}`);
    const vf = [GRADE, `scale=-2:${h}:flags=lanczos`].filter(Boolean).join(',');
    run('ffmpeg', ['-v', 'error', '-y', '-i', film, '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', h >= 2160 ? '24' : '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}.mp4`]);
    run('ffmpeg', ['-v', 'error', '-y', '-i', film, '-an', '-vf', vf, '-c:v', 'libsvtav1', '-preset', '6', '-crf', h >= 2160 ? '34' : '32', '-pix_fmt', 'yuv420p10le', `${base}.webm`]);
    out[h] = { mp4: kb(`${base}.mp4`), webm: kb(`${base}.webm`) };
    console.log(`intro ${theme} ${h}p: mp4 ${out[h].mp4} KB, webm ${out[h].webm} KB`);
  }
  run('ffmpeg', ['-v', 'error', '-y', '-i', film, '-vf', 'scale=-2:1080', '-frames:v', '1', join('public/intro', `${theme}-first.png`)]);
  run('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.1', '-i', film, '-vf', 'scale=-2:1080', '-frames:v', '1', join('public/intro', `${theme}-last.png`)]);
  for (const k of ['first', 'last']) {
    run('cwebp', ['-quiet', '-q', '70', join('public/intro', `${theme}-${k}.png`), '-o', join('public/intro', `${theme}-${k}.webp`)]);
    rmSync(join('public/intro', `${theme}-${k}.png`));
  }
  intro[theme] = { heights, sizes: out, duration: duration(film) };
}
if (Object.keys(intro).length) writeFileSync('public/intro/manifest.json', JSON.stringify({ ...intro, 'generated-at': new Date().toISOString() }, null, 2));
console.log('done');
