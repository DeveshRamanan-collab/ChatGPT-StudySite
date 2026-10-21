import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

// WAI-ARIA tabs with roving tabindex (arrow keys, Home/End). The indicator moves by transform only.
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(() => tabs.findIndex((t) => !t.disabled));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const id = useId();

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[active];
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [active]);

  const move = (e: KeyboardEvent, i: number) => {
    const enabled = tabs.map((t, j) => (t.disabled ? -1 : j)).filter((j) => j >= 0);
    const pos = enabled.indexOf(i);
    const next =
      e.key === 'ArrowRight' ? enabled[(pos + 1) % enabled.length]
      : e.key === 'ArrowLeft' ? enabled[(pos - 1 + enabled.length) % enabled.length]
      : e.key === 'Home' ? enabled[0]
      : e.key === 'End' ? enabled[enabled.length - 1]
      : undefined;
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={label} ref={list}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { refs.current[i] = el; }}
            className="tabs__tab"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            disabled={t.disabled}
            onClick={() => setActive(i)}
            onKeyDown={(e) => move(e, i)}
          >
            {t.label}
          </button>
        ))}
        <span className="tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` }} />
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} className="tabs__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={i !== active} tabIndex={0}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
