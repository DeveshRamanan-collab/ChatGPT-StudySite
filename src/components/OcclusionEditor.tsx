// Image-occlusion authoring: pick a diagram (or add your own image), drag boxes over the labels to hide, name
// each, choose the concept, save. Each box becomes a hidden label on one occlusion card, scheduled with FSRS.
// Keyboard: arrow keys nudge the selected box, Shift+arrows resize, Delete removes it.
import { useEffect, useRef, useState } from 'react';
import { db } from '../lib/db';

type Mask = { x: number; y: number; w: number; h: number; label: string };
interface Props { images: { src: string; label: string; unit: string }[] }

export default function OcclusionEditor({ images }: Props) {
  const [src, setSrc] = useState(images[0]?.src ?? '');
  const [unit, setUnit] = useState(images[0]?.unit ?? '');
  const [masks, setMasks] = useState<Mask[]>([]);
  const [sel, setSel] = useState(-1);
  const [concepts, setConcepts] = useState<{ id: string; title: string; unit: string }[]>([]);
  const [concept, setConcept] = useState('');
  const [msg, setMsg] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetch('/data/overview.json').then((r) => r.json()).then((ov) => setConcepts(ov.flatMap((u: any) => u.weeks.flatMap((w: any) => w.concepts.map((c: any) => ({ id: c.id, title: c.title, unit: u.id }))))));
  }, []);
  useEffect(() => { const first = concepts.find((c) => c.unit === unit); if (first && !concepts.some((c) => c.id === concept && c.unit === unit)) setConcept(first.id); }, [unit, concepts]);

  const rel = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) }; };
  const down = (e: React.PointerEvent) => { if ((e.target as HTMLElement).closest('.occ-mask')) return; drag.current = rel(e); (e.target as HTMLElement).setPointerCapture(e.pointerId); setMasks((m) => [...m, { ...drag.current!, w: 0, h: 0, label: '' }]); setSel(masks.length); };
  const move = (e: React.PointerEvent) => { if (!drag.current) return; const p = rel(e), o = drag.current; setMasks((m) => m.map((k, i) => (i === m.length - 1 ? { ...k, x: Math.min(o.x, p.x), y: Math.min(o.y, p.y), w: Math.abs(p.x - o.x), h: Math.abs(p.y - o.y) } : k))); };
  const up = () => { if (!drag.current) return; drag.current = null; setMasks((m) => m.filter((k) => k.w > 0.01 && k.h > 0.01)); };
  const key = (e: React.KeyboardEvent) => {
    if (sel < 0 || (e.target as HTMLElement).tagName === 'INPUT') return;
    const d = 0.005;
    const map: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] };
    if (map[e.key]) { e.preventDefault(); const [dx, dy] = map[e.key]; setMasks((m) => m.map((k, i) => (i !== sel ? k : e.shiftKey ? { ...k, w: Math.max(0.01, k.w + dx), h: Math.max(0.01, k.h + dy) } : { ...k, x: k.x + dx, y: k.y + dy }))); }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); setMasks((m) => m.filter((_, i) => i !== sel)); setSel(-1); }
  };

  async function save() {
    const ok = masks.filter((m) => m.label.trim());
    if (!ok.length || !concept) { setMsg('Draw at least one box and name what it hides.'); return; }
    await db.customCards.put({ id: `custom-occ-${Date.now().toString(36)}`, concept, unit, type: 'occlusion', front: 'Name each hidden label.', back: ok.map((m) => m.label).join(' · '), image: src, masks: ok, source: images.find((i) => i.src === src)?.label ?? 'your image', at: Date.now() });
    setMsg(`Saved a card with ${ok.length} hidden ${ok.length === 1 ? 'label' : 'labels'}. It joins today’s ${unit.toUpperCase()} cards.`);
    setMasks([]); setSel(-1);
  }

  return (
    <div className="occ">
      <div className="occ__controls">
        <label className="label" htmlFor="occ-img">Diagram</label>
        <select id="occ-img" className="cmp-select" value={src} onChange={(e) => { setSrc(e.target.value); setUnit(images.find((i) => i.src === e.target.value)?.unit ?? unit); setMasks([]); }}>
          {images.map((i) => <option key={i.src} value={i.src}>{i.label}</option>)}
          {src.startsWith('data:') && <option value={src}>Your image</option>}
        </select>
        <label className="btn btn--ghost btn--sm occ__upload">Use my own image<input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setSrc(String(r.result)); setMasks([]); }; r.readAsDataURL(f); }} /></label>
        <label className="label" htmlFor="occ-concept">Concept</label>
        <select id="occ-concept" className="cmp-select" value={concept} onChange={(e) => { setConcept(e.target.value); setUnit(concepts.find((c) => c.id === e.target.value)?.unit ?? unit); }}>
          {concepts.map((c) => <option key={c.id} value={c.id}>{c.unit.toUpperCase()} · {c.title}</option>)}
        </select>
      </div>
      <p className="occ__hint">Drag over each label you want to hide. Select a box to name it; arrows nudge, Shift+arrows resize, Delete removes.</p>
      <div className="occ__stage" ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onKeyDown={key} tabIndex={0} data-cursor="drag" role="application" aria-label="Diagram: drag to add a hidden box">
        {src && <img src={src} alt="" draggable={false} />}
        {masks.map((m, i) => (
          <button key={i} type="button" className="occ-mask" data-selected={i === sel || undefined} style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, width: `${m.w * 100}%`, height: `${m.h * 100}%` }} onClick={() => setSel(i)} aria-label={`Box ${i + 1}${m.label ? `: ${m.label}` : ''}`}>
            <span>{i + 1}</span>
          </button>
        ))}
      </div>
      {masks.length > 0 && (
        <ol className="occ__labels">
          {masks.map((m, i) => (
            <li key={i}><label className="visually-hidden" htmlFor={`occ-l-${i}`}>Label hidden by box {i + 1}</label><input id={`occ-l-${i}`} className="occ__input" value={m.label} placeholder={`What box ${i + 1} hides`} onFocus={() => setSel(i)} onChange={(e) => setMasks((ms) => ms.map((k, j) => (j === i ? { ...k, label: e.target.value } : k)))} /></li>
          ))}
        </ol>
      )}
      <p className="occ__actions"><button className="btn btn--primary" type="button" onClick={save} disabled={!masks.length}>Save card</button> <span className="occ__msg" role="status" aria-live="polite">{msg}</span></p>
    </div>
  );
}
