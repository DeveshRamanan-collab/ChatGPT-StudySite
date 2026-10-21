// Settings → Your data: export / import JSON, optional Gist sync.
import { useRef, useState } from 'react';
import { exportAll, download, parseBackup, importAll, gistToken, setGistToken, pushGist, pullGist } from '../lib/backup';

export default function DataTools() {
  const [msg, setMsg] = useState('');
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? '' : gistToken()));
  const file = useRef<HTMLInputElement>(null);
  const run = async (f: () => Promise<string>) => { setMsg('Working…'); try { setMsg(await f()); } catch (e) { setMsg((e as Error).message); } };
  const summary = (c: Record<string, number>) => `${c.attempts ?? 0} answers, ${c.cards ?? 0} card states, ${c.reviews ?? 0} reviews, ${c.annotations ?? 0} notes`;
  return (
    <div className="data-tools">
      <p>Everything you have done is stored in this browser. Export it to keep a copy or move to another device.</p>
      <p className="data-tools__row">
        <button className="btn btn--secondary" type="button" onClick={() => run(async () => { const b = await exportAll(); download(b); return `Exported ${summary(Object.fromEntries(Object.entries(b.tables).map(([k, v]) => [k, v.length])))}.`; })}>Export JSON</button>
        <button className="btn btn--ghost" type="button" onClick={() => file.current?.click()}>Import JSON…</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) run(async () => { const c = await importAll(parseBackup(await f.text()), mode); return `Imported ${summary(c)} (${mode}). Reload to see it everywhere.`; }); e.target.value = ''; }} />
      </p>
      <fieldset className="data-tools__mode">
        <legend className="label">When importing</legend>
        <label><input type="radio" name="imp" checked={mode === 'merge'} onChange={() => setMode('merge')} /> Merge with what is here</label>
        <label><input type="radio" name="imp" checked={mode === 'replace'} onChange={() => setMode('replace')} /> Replace what is here</label>
      </fieldset>
      <details className="data-tools__gist">
        <summary>Optional: sync through a private GitHub Gist</summary>
        <p>Paste a GitHub token with only the <span className="mono">gist</span> scope. It stays on this device and is never exported.</p>
        <label className="label" htmlFor="gist-token">Token</label>
        <input id="gist-token" className="data-tools__token" type="password" autoComplete="off" value={token} onChange={(e) => { setToken(e.target.value); setGistToken(e.target.value.trim()); }} />
        <p className="data-tools__row">
          <button className="btn btn--secondary btn--sm" type="button" disabled={!token} onClick={() => run(async () => `Saved to gist ${await pushGist()}.`)}>Save to Gist</button>
          <button className="btn btn--ghost btn--sm" type="button" disabled={!token} onClick={() => run(async () => { const c = await importAll(await pullGist(), mode); return `Loaded ${summary(c)} from the gist (${mode}).`; })}>Load from Gist</button>
        </p>
      </details>
      <p className="data-tools__msg" role="status" aria-live="polite">{msg}</p>
    </div>
  );
}
