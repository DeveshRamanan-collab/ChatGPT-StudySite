// Reading aids on notes pages (CLAUDE.md research rules):
//  • after 3 minutes of visible reading, one quiet nudge to switch to retrieval (once per page load);
//  • a delayed judgement of learning: on a return visit ≥ 1 hour after the last read, ask how well you could explain
//    this now, before rereading (stored for calibration);
//  • marks the page as read after 60 visible seconds.
import { useEffect, useRef, useState } from 'react';
import { db } from '../lib/db';
import { toast } from './ui/Toaster';

export const NUDGE_MS = 3 * 60_000;
const READ_MS = 60_000;
const JOL_DELAY = 60 * 60_000;
type Jol = 'not-yet' | 'partly' | 'well';

export default function ReadingAids({ pageKey, title, quizHref }: { pageKey: string; title: string; quizHref: string }) {
  const [askJol, setAskJol] = useState(false);
  const [answered, setAnswered] = useState<Jol | null>(null);
  // Timing starts when the island renders (hydration), not when effects are scheduled.
  const mountedAt = useRef(performance.now());

  useEffect(() => {
    let visibleMs = 0;
    let last = mountedAt.current;
    let nudged = false;
    let marked = false;
    const tick = () => {
      const now = performance.now();
      if (document.visibilityState === 'visible') visibleMs += now - last;
      last = now;
      if (!marked && visibleMs >= READ_MS) {
        marked = true;
        db.settings.put({ key: `read:${pageKey}`, value: Date.now() }).catch(() => {});
      }
      if (!nudged && visibleMs >= NUDGE_MS) {
        nudged = true;
        toast({ message: 'Three minutes in. Close the notes and try recalling it?', action: { label: 'Quiz me', href: quizHref }, duration: 12_000 });
      }
    };
    const t = setInterval(tick, 1000);
    const onVis = () => { last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    Promise.all([db.settings.get(`read:${pageKey}`), db.settings.get(`jol:${pageKey}`)])
      .then(([read, jol]) => {
        const lastRead = read?.value as number | undefined;
        const lastJol = (jol?.value as { at: number }[] | undefined)?.at(-1)?.at ?? 0;
        if (lastRead && Date.now() - lastRead >= JOL_DELAY && lastJol < lastRead) setAskJol(true);
      })
      .catch(() => {});
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, [pageKey, quizHref]);

  const answer = async (value: Jol) => {
    setAnswered(value);
    const prev = ((await db.settings.get(`jol:${pageKey}`))?.value as { at: number; value: Jol }[] | undefined) ?? [];
    await db.settings.put({ key: `jol:${pageKey}`, value: [...prev, { at: Date.now(), value }] });
  };

  if (!askJol) return null;
  return (
    <aside className="jol" aria-labelledby="jol-q" data-answered={answered ?? undefined}>
      {answered ? (
        <p className="jol__thanks">Noted. {answered === 'well' ? 'Test that with a quick quiz before rereading.' : 'Read with that in mind.'} <a href={quizHref}>Quiz me</a></p>
      ) : (
        <>
          <p id="jol-q" className="jol__q">Before you reread: how well could you explain <strong>{title}</strong> right now?</p>
          <div className="jol__opts">
            <button type="button" className="chip" onClick={() => answer('not-yet')}>Not yet</button>
            <button type="button" className="chip" onClick={() => answer('partly')}>Partly</button>
            <button type="button" className="chip" onClick={() => answer('well')}>Well</button>
          </div>
        </>
      )}
    </aside>
  );
}
