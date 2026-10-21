import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  label?: string;
  /** Accessible name for an icon-only trigger. */
  triggerLabel?: string;
}

// Origin-aware popover: opens below (or above when there is no room), grows from the edge nearest the trigger.
// 120ms in, 200ms out; Esc or an outside click closes; focus returns to the trigger. Never a hard modal.
export function Popover({ trigger, children, triggerClassName = 'chip', label, triggerLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, origin: 'top left' });
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  const place = useCallback(() => {
    const b = btn.current?.getBoundingClientRect();
    const p = panel.current;
    if (!b || !p) return;
    const w = p.offsetWidth, h = p.offsetHeight, m = 8, vw = innerWidth, vh = innerHeight;
    const below = b.bottom + m + h <= vh || b.top - m - h < 0;
    const top = below ? b.bottom + m : b.top - m - h;
    const left = Math.max(16, Math.min(b.left, vw - w - 16));
    const ox = Math.max(0, Math.min(w, b.left + b.width / 2 - left));
    setPos({ top, left, origin: `${ox}px ${below ? 'top' : 'bottom'}` });
  }, []);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = () => place();
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onDown);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onDown);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [open, place]);

  return (
    <>
      <button ref={btn} type="button" className={triggerClassName} aria-label={triggerLabel} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </button>
      {mounted && createPortal(
      <div
        ref={panel}
        id={id}
        className="popover glass"
        role="dialog"
        aria-label={label}
        data-open={open}
        inert={!open}
        style={{ top: pos.top, left: pos.left, transformOrigin: pos.origin }}
      >
        {children}
      </div>,
      document.body,
      )}
    </>
  );
}
