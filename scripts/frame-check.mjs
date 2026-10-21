// CDP frame check: scrolls a route at 4× CPU throttle and reports the share of frames under 16.7ms.
// Usage: node scripts/frame-check.mjs /laws2400/ [/laws2400/concept/w02-battery/ …]   (preview server on :4321)
import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
for (const route of process.argv.slice(2)) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date()); localStorage.setItem('studysite:intro-day', d); }); if (process.env.LEVEL) await p.addInitScript((l) => localStorage.setItem('studysite:motion', l), process.env.LEVEL);
  const cdp = await p.context().newCDPSession(p);
  await p.goto('http://localhost:4321' + route); await p.waitForLoadState('networkidle'); await p.waitForTimeout(+(process.env.SETTLE || 3000));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.RATE || 4) });
  const r = await p.evaluate(async () => {
    const H = Math.min(document.documentElement.scrollHeight - innerHeight, 9000);
    const d = []; let last = performance.now(), run = true;
    const f = (t) => { d.push(t - last); if (t - last > 18) (window.__slow ??= []).push(Math.round(scrollY)); last = t; if (run) requestAnimationFrame(f); }; requestAnimationFrame(f);
    for (let y = 0; y < H; y += 14) { scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)); }
    run = false; const x = d.slice(5);
    return { slow: (window.__slow || []).join(","), frames: x.length, under: +(x.filter((v) => v < 16.7 * 1.05).length / x.length).toFixed(3) };
  });
  console.log(route, JSON.stringify(r));
  await p.close();
}
await b.close();
