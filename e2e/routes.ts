// Every built route, discovered from dist/ so new pages are covered automatically. Run `npm run build` first.
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function builtRoutes(dir = 'dist', base = ''): string[] {
  if (!existsSync(dir)) throw new Error('dist/ missing: run npm run build before e2e');
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...builtRoutes(p, `${base}/${e}`));
    else if (e === 'index.html') out.push(base ? `${base}/` : '/');
  }
  return out.sort();
}

/** First built route matching a pattern (tests use this instead of hard-coding content slugs). */
export function firstRoute(re: RegExp): string {
  const r = builtRoutes().find((x) => re.test(x));
  if (!r) throw new Error(`no built route matches ${re}`);
  return r;
}
