// Render-check explainers for concept ids with a prefix: desktop+phone × full/calm/off; console errors, page overflow,
// SVG text outside its svg. Needs the preview server (npm run build && npm run preview). Screenshots → reports/review/<out>.
// Usage: node scripts/render-check.mjs <concept-id prefix, e.g. laws2400-w09> [out-subdir]. Exits 1 on any problem.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
const ids = Object.keys(JSON.parse(readFileSync('src/components/explainers/manifest.json'))).filter((k) => k.startsWith(process.argv[2]));
const OUT = `reports/review/${process.argv[3] || 'x'}`; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' }); // locally: the installed Google Chrome
const rows = [];
for (const [vk, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) for (const motion of ['full', 'calm', 'off']) for (const id of ids) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: vk === 'phone', hasTouch: vk === 'phone' });
  await ctx.addInitScript(([m, wk]) => { localStorage.setItem('studysite:motion', m); localStorage.setItem('studysite:intro-day', new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date())); localStorage.setItem('studysite:pretest:' + wk, 'skip'); }, [motion, id.slice(0, 12)]);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`http://localhost:4321/${id.split('-')[0]}/concept/${id.split('-').slice(1).join('-')}`, { waitUntil: 'networkidle' });
  await p.locator('[data-explainer], .explainer, #explainer').first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1000);
  const m = await p.evaluate(() => {
    const overX = document.documentElement.scrollWidth > innerWidth + 1; const clipped = [];
    for (const t of document.querySelectorAll('svg text')) { const svg = t.ownerSVGElement; if (!svg || !t.getClientRects().length) continue;
      const r = t.getBoundingClientRect(), s = svg.getBoundingClientRect();
      if (r.width && (r.left < s.left - 2 || r.right > s.right + 2 || r.top < s.top - 2 || r.bottom > s.bottom + 2)) clipped.push(t.textContent.slice(0, 30)); }
    return { overX, clipped };
  });
  if (motion !== 'calm') await p.screenshot({ path: `${OUT}/${id}-${vk}-${motion}.png` });
  rows.push({ id, vk, motion, errs: errs.slice(0, 1).join('').slice(0, 80), overX: m.overX, clipped: m.clipped.join(' | ').slice(0, 60) });
  await ctx.close();
}
await b.close();
const bad = rows.filter((r) => r.errs || r.overX || r.clipped);
for (const r of bad) console.log('PROBLEM', r.id, r.vk, r.motion, r.errs, r.overX ? 'overflow-x' : '', r.clipped);
console.log(`${process.argv[2]}: ${rows.length} renders; ${bad.length} with problems`);
if (bad.length) process.exitCode = 1;
