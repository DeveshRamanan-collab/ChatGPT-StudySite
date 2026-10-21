// CDP frame check for the intro film: node scripts/intro-perf.mjs (preview server on :4321; RATE=4 default).
import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await p.context().newCDPSession(p);
await p.goto('http://localhost:4321/'); await p.waitForLoadState('networkidle'); await p.waitForTimeout(3000);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.RATE||4) });
const res = await p.evaluate(async () => {
  const H = document.querySelector('[data-intro]').offsetHeight;
  const deltas = []; let last = performance.now(); let run = true;
  const f = (t) => { deltas.push(t - last); last = t; if (run) requestAnimationFrame(f); }; requestAnimationFrame(f);
  for (let y = 0; y < H * 0.9; y += 12) { scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); }
  run = false;
  const d = deltas.slice(5);
  return { frames: d.length, under: d.filter(x => x < 16.7 * 1.05).length / d.length, p95: d.sort((a,b)=>a-b)[Math.floor(d.length*0.95)] };
});
console.log(JSON.stringify(res));
await b.close();
