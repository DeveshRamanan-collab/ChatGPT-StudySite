// Per-week audio recap: the week's 2–3 minute script spoken by the browser at 1.2×; progress by sentence,
// Space pauses; the transcript is one click away and highlights the sentence being read when open.
import { useEffect, useRef, useState } from 'react';
import { read, stop, togglePause, segmentsOf, segmentsOfText, speechSupported } from '../lib/speech';

export default function AudioRecap({ title, minutes, script }: { title: string; minutes?: number; script: string }) {
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [pos, setPos] = useState({ i: 0, n: 1 });
  const [ok, setOk] = useState(true);
  const text = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => { setOk(speechSupported()); return () => { stop(); }; }, []);
  const play = () => {
    if (state === 'playing' || state === 'paused') { const p = togglePause(); setState(p ? 'paused' : 'playing'); return; }
    const segs = details.current?.open && text.current ? segmentsOf(text.current) : segmentsOfText(script);
    setState('playing');
    read(segs, { onProgress: (i, n) => setPos({ i, n }), onEnd: () => { setState('idle'); setPos({ i: 0, n: 1 }); } });
  };
  return (
    <section className="recap-player" aria-label="Audio recap">
      <div className="recap-player__row">
        <button className="btn btn--secondary btn--sm" type="button" onClick={play} disabled={!ok} aria-pressed={state === 'playing'}>
          {state === 'playing' ? 'Pause' : state === 'paused' ? 'Resume' : 'Listen to the recap'}
        </button>
        {state !== 'idle' && <button className="btn btn--ghost btn--sm" type="button" onClick={() => { stop(); setState('idle'); }}>Stop</button>}
        <span className="recap-player__meta">{title}{minutes ? ` · about ${minutes} min` : ''}{!ok ? ' · no speech voice in this browser' : ''}</span>
      </div>
      <div className="recap-player__bar" aria-hidden="true"><span style={{ transform: `scaleX(${state === 'idle' ? 0 : (pos.i + 1) / pos.n})` }} /></div>
      <details ref={details} className="recap-player__script">
        <summary>Transcript</summary>
        <div ref={text} className="prose">{script.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
      </details>
    </section>
  );
}
