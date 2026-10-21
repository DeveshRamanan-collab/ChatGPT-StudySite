// Optional study companion: a small ink lamp that keeps you company during a block. Its own progress bar advances
// beside yours; it says one plain sentence at a quarter, half and the end. Off by default (settings).
import { useEffect, useState } from 'react';
import { prefs } from '../lib/prefs';

const LINES: [number, string][] = [[1, 'Block done. Good work staying with it.'], [0.5, 'Halfway. Still here with you.'], [0.25, 'A quarter in. Steady.']];

export default function Companion({ elapsed, total }: { elapsed: number; total: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(prefs().companion === 'lamp');
    sync();
    document.addEventListener('studysite:prefs', sync);
    return () => document.removeEventListener('studysite:prefs', sync);
  }, []);
  if (!on) return null;
  const frac = Math.max(0, Math.min(1, elapsed / total));
  const line = LINES.find(([at]) => frac >= at)?.[1] ?? 'Here if you need company.';
  return (
    <div className="companion" aria-label="Study companion">
      <svg className="companion__lamp" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <circle className="companion__glow" cx="12" cy="11" r="7" />
        <path d="M8 10 L12 4 L16 10 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 10 V19 M8.5 19.5 H15.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <div className="companion__bar" aria-hidden="true"><span style={{ transform: `scaleX(${frac})` }} /></div>
      <p className="companion__line" aria-live="polite">{line}</p>
    </div>
  );
}
