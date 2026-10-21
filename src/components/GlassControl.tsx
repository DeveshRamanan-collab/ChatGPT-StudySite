// Glass on/off and tint strength. Rendered in the header's "…" overflow (compact) and on /settings (full).
// Writes html[data-glass] and --glass-opacity live; persisted in prefs (localStorage mirror → pre-paint script).
import { useEffect, useState } from 'react';
import { prefs, setPrefs } from '../lib/prefs';
import { Popover } from './ui/Popover';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-transparency: reduce)').matches;

export function GlassFields({ idPrefix = 'glass' }: { idPrefix?: string }) {
  const [on, setOn] = useState(true);
  const [op, setOp] = useState(0.55);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const sync = () => { const p = prefs(); setOn(p.glass !== 'off'); setOp(p.glassOpacity); };
    sync(); setBlocked(reduced());
    document.addEventListener('studysite:prefs', sync);
    return () => document.removeEventListener('studysite:prefs', sync);
  }, []);
  const write = (patch: { glass?: 'on' | 'off'; glassOpacity?: number }) => setPrefs(patch); // chrome.ts applies to <html>
  return (
    <div className="glass-fields">
      <label className="glass-fields__row" htmlFor={`${idPrefix}-on`}>
        <input id={`${idPrefix}-on`} type="checkbox" checked={on && !blocked} disabled={blocked} onChange={(e) => write({ glass: e.target.checked ? 'on' : 'off' })} />
        <span>Glass surfaces</span>
      </label>
      {blocked && <p className="glass-fields__note">Off because your system asks for reduced transparency.</p>}
      <label className="glass-fields__slider" htmlFor={`${idPrefix}-op`}>
        <span className="label">Glass opacity</span>
        <input id={`${idPrefix}-op`} type="range" min={0.2} max={0.9} step={0.05} value={op} disabled={!on || blocked}
          onChange={(e) => { const v = Number(e.target.value); setOp(v); document.documentElement.style.setProperty('--glass-opacity', String(v)); write({ glassOpacity: v }); }}
          aria-valuetext={`${Math.round(op * 100)}%`} data-cursor="drag" />
        <span className="glass-fields__val mono">{Math.round(op * 100)}%</span>
      </label>
    </div>
  );
}

export default function GlassControl() {
  return (
    <Popover trigger={<span aria-hidden="true">⋯</span>} triggerClassName="dial-more" label="Glass settings" triggerLabel="More display settings">
      <GlassFields idPrefix="glass-pop" />
      <p className="glass-fields__link"><a href="/settings">All settings</a></p>
    </Popover>
  );
}
