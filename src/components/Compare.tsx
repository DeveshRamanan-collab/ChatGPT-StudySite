// Compare mode: two cases or two concepts (theories) side by side, scroll-synchronised. Pick each side from the
// search index; the content is the real page's card, fetched and shown in place. URL: /compare?a=<href>&b=<href>.
import { useEffect, useRef, useState } from 'react';

type Item = { k: string; t: string; s?: string; h: string };

function useIndex() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { fetch('/data/search-index.json').then((r) => r.json()).then((xs: Item[]) => setItems(xs.filter((x) => x.k === 'case' || x.k === 'concept'))); }, []);
  return items;
}

async function load(href: string) {
  const html = await (await fetch(href)).text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = doc.querySelector('h1')?.textContent ?? href;
  const body = doc.querySelector('.case-card') ?? doc.querySelector('main article.prose');
  body?.querySelectorAll('script, astro-island, button').forEach((n) => n.remove());
  return { title, html: body?.outerHTML ?? '<p>Nothing to show.</p>' };
}

function Side({ label, value, onPick, items, paneRef, onScroll }: { label: string; value: string; onPick: (h: string) => void; items: Item[]; paneRef: React.RefObject<HTMLDivElement | null>; onScroll: () => void }) {
  const [doc, setDoc] = useState<{ title: string; html: string } | null>(null);
  useEffect(() => { if (value) { setDoc(null); load(value).then(setDoc); } }, [value]);
  const id = `cmp-${label}`;
  return (
    <section className="cmp-side" aria-labelledby={`${id}-h`}>
      <label className="label" htmlFor={id}>{label}</label>
      <select id={id} className="cmp-select" value={value} onChange={(e) => onPick(e.target.value)}>
        <option value="">Choose a case or concept…</option>
        <optgroup label="Cases">{items.filter((i) => i.k === 'case').map((i) => <option key={i.h} value={i.h}>{i.t}</option>)}</optgroup>
        <optgroup label="Concepts">{items.filter((i) => i.k === 'concept').map((i) => <option key={i.h} value={i.h}>{i.t} ({i.s})</option>)}</optgroup>
      </select>
      <h2 id={`${id}-h`} className="cmp-title">{doc?.title ?? (value ? 'Loading…' : '—')}</h2>
      <div className="cmp-pane prose" ref={paneRef} onScroll={onScroll} tabIndex={0} role="region" aria-label={`${label} content`} dangerouslySetInnerHTML={{ __html: doc?.html ?? '' }} />
    </section>
  );
}

export default function Compare() {
  const items = useIndex();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const pa = useRef<HTMLDivElement>(null), pb = useRef<HTMLDivElement>(null);
  const lock = useRef<HTMLDivElement | null>(null);
  useEffect(() => { const p = new URLSearchParams(location.search); setA(p.get('a') ?? ''); setB(p.get('b') ?? ''); }, []);
  useEffect(() => { const u = new URL(location.href); a ? u.searchParams.set('a', a) : u.searchParams.delete('a'); b ? u.searchParams.set('b', b) : u.searchParams.delete('b'); history.replaceState(history.state, '', u); }, [a, b]);
  // Proportional scroll sync; the pane being scrolled leads, the other follows instantly (never animated).
  const sync = (from: HTMLDivElement | null, to: HTMLDivElement | null) => {
    if (!from || !to || (lock.current && lock.current !== from)) return;
    lock.current = from;
    const f = from.scrollTop / Math.max(1, from.scrollHeight - from.clientHeight);
    to.scrollTop = f * (to.scrollHeight - to.clientHeight);
    requestAnimationFrame(() => { lock.current = null; });
  };
  return (
    <div className="cmp">
      <Side label="Left" value={a} onPick={setA} items={items} paneRef={pa} onScroll={() => sync(pa.current, pb.current)} />
      <Side label="Right" value={b} onPick={setB} items={items} paneRef={pb} onScroll={() => sync(pb.current, pa.current)} />
    </div>
  );
}
