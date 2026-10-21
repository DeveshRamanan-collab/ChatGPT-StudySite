import { useEffect, useState } from 'react';

export interface ToastInput {
  message: string;
  action?: { label: string; href?: string; event?: string };
  duration?: number;
}
interface ToastItem extends ToastInput { id: number; leaving?: boolean }

const EVENT = 'ss:toast';

/** Fire a toast from anywhere (islands or plain scripts). */
export function toast(input: ToastInput | string) {
  const detail = typeof input === 'string' ? { message: input } : input;
  const w = window as unknown as { __ssToaster?: boolean; __ssToastQueue?: ToastInput[] };
  // Before the toaster has mounted (islands hydrate independently), queue; it drains the queue on mount.
  if (!w.__ssToaster) (w.__ssToastQueue ??= []).push(detail);
  else window.dispatchEvent(new CustomEvent<ToastInput>(EVENT, { detail }));
}

let seq = 0;

// Quiet, informational toasts. Polite live region; never guilt copy.
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    const dismiss = (id: number) => {
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 200);
    };
    const on = (e: Event) => {
      const t = { ...(e as CustomEvent<ToastInput>).detail, id: ++seq };
      setItems((xs) => [...xs.slice(-2), t]);
      setTimeout(() => dismiss(t.id), t.duration ?? 4000);
    };
    addEventListener(EVENT, on);
    const w = window as unknown as { __ssToaster?: boolean; __ssToastQueue?: ToastInput[] };
    w.__ssToaster = true;
    for (const detail of w.__ssToastQueue?.splice(0) ?? []) on(new CustomEvent(EVENT, { detail }));
    return () => { w.__ssToaster = false; removeEventListener(EVENT, on); };
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="toast glass" data-leaving={t.leaving || undefined}>
          <span style={{ flex: 1 }}>{t.message}</span>
          {t.action && (t.action.href
            ? <a className="btn" href={t.action.href}>{t.action.label}</a>
            : <button className="btn" type="button" onClick={() => t.action?.event && dispatchEvent(new CustomEvent(t.action.event))}>{t.action.label}</button>)}
        </div>
      ))}
    </div>
  );
}
