// /<unit>/listen: two tabs, Listen (questions read aloud) and Viva (an examiner's questions with follow-ups).
// Only the open tab is mounted, so switching tabs stops any speech. ?tab=viva opens the Viva tab (deep links from
// concept pages); the choice is kept in the URL.
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import ListenQuiz from './ListenQuiz';
import Viva from './Viva';

const TABS = [
  { id: 'listen', label: 'Listen' },
  { id: 'viva', label: 'Viva' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function ListenPage({ unit, initial = 'listen' }: { unit: string; initial?: TabId }) {
  const [tab, setTab] = useState<TabId>(initial);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const active = TABS.findIndex((t) => t.id === tab);

  useLayoutEffect(() => {
    const want = new URLSearchParams(location.search).get('tab');
    if (want === 'viva' || want === 'listen') setTab(want);
  }, []);

  useLayoutEffect(() => {
    const measure = () => { const el = refs.current[active]; if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth }); };
    measure();
    const ro = new ResizeObserver(measure);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [active]);

  const choose = (id: TabId, focus = false) => {
    setTab(id);
    const u = new URL(location.href);
    if (id === 'listen') u.searchParams.delete('tab'); else u.searchParams.set('tab', id);
    history.replaceState(history.state, '', u);
    if (focus) refs.current[TABS.findIndex((t) => t.id === id)]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const k = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1;
    if (k < 0) return;
    e.preventDefault();
    choose(TABS[k].id, true);
  };

  return (
    <div className="listen-page">
      <div className="tabs__list listen-page__tabs" role="tablist" aria-label="Listening practice" ref={list}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            className="tabs__tab"
            role="tab"
            id={`listen-tab-${t.id}`}
            aria-selected={t.id === tab}
            aria-controls={`listen-panel-${t.id}`}
            tabIndex={t.id === tab ? 0 : -1}
            onClick={() => choose(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
        <span className="tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` }} />
      </div>
      <div className="listen-page__panel" role="tabpanel" id={`listen-panel-${tab}`} aria-labelledby={`listen-tab-${tab}`}>
        {tab === 'listen' ? <ListenQuiz unit={unit} /> : <Viva unit={unit} />}
      </div>
    </div>
  );
}
