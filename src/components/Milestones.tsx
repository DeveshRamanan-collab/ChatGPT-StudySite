// Shows one milestone stamp at a time, once each: mastery 50/80/95%, queue cleared, personal bests.
// Quiet: no sound, no confetti; it fades after five seconds.
import { useEffect, useState } from 'react';
import { useStudy, startStudySync } from '../lib/store';
import { detect, type Milestone } from '../lib/milestones';
import { dayKey } from '../lib/selectors';
import { Stamp } from './ui/Stamp';

const KEY = 'studysite:milestones';
const seen = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } };
const mark = (k: string) => { const s = seen().add(k); try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {} };

export default function Milestones() {
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const ready = useStudy((s) => s.ready);
  const [units, setUnits] = useState<{ id: string; code: string; concepts: string[] }[] | null>(null);
  const [shown, setShown] = useState<Milestone | null>(null);
  const [queue, setQueue] = useState<Milestone[]>([]);

  useEffect(() => {
    // Only wake the data layer on pages where study happens (or once something is answered).
    const onMs = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.kind === 'queue-cleared') {
        const key = `queue-cleared:${dayKey(Date.now())}`;
        if (!seen().has(key)) setQueue((q) => [...q, { key, big: 'Clear', label: 'today’s cards are done' }]);
      }
    };
    document.addEventListener('studysite:milestone', onMs);
    if (/\/(quiz|cards|exam|dashboard)/.test(location.pathname)) startStudySync();
    return () => document.removeEventListener('studysite:milestone', onMs);
  }, []);

  useEffect(() => {
    if (!ready || units) return;
    fetch('/data/overview.json').then((r) => r.json()).then((ov) => setUnits(ov.map((u: any) => ({ id: u.id, code: u.code, concepts: u.weeks.flatMap((w: any) => w.concepts.map((c: any) => c.id)) }))));
  }, [ready]);

  useEffect(() => {
    if (!units || !ready || !attempts.length) return;
    const found = detect({ units, attempts, criteria, seen: seen(), now: Date.now() });
    // First run on a device with history: record silently so old milestones don't replay.
    if (!localStorage.getItem(KEY)) { found.forEach((m) => mark(m.key)); try { localStorage.setItem(KEY, JSON.stringify([...seen()])); } catch {} return; }
    if (found.length) setQueue((q) => [...q, ...found.filter((f) => !q.some((x) => x.key === f.key))]);
  }, [units, ready, attempts, criteria]);

  useEffect(() => {
    if (shown || !queue.length) return;
    const [m, ...rest] = queue;
    mark(m.key);
    setShown(m);
    setQueue(rest);
    const t = setTimeout(() => setShown(null), 5000);
    return () => clearTimeout(t);
  }, [queue, shown]);

  if (!shown) return null;
  return (
    <div className="milestone" role="status" aria-live="polite">
      <Stamp big={shown.big} label={shown.label} animate />
      <button className="btn btn--ghost btn--sm" type="button" onClick={() => setShown(null)}>Dismiss</button>
    </div>
  );
}
