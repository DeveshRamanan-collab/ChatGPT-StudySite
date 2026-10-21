// After a wrong answer (features 133, 134, 143): what kind of error it was (by the confidence given), the concept's
// common mistakes from its study aid, and where to go next: practise the idea, drill it against the idea it is
// confused with, or repair a shaky prerequisite first. Everything degrades to nothing when the data is not there.
import { useEffect, useState } from 'react';
import { loadAids, type Aid } from '../../lib/aids';
import type { Confidence } from '../../lib/db';
import { accuracyByConcept } from '../../lib/selectors';
import { startStudySync, useStudy } from '../../lib/store';
import { loadBank, type Bank, type ConceptMeta } from './types';
import '../../styles/practice.css';

const banks = new Map<string, Promise<Bank>>();
/** The unit's full question bank, fetched at most once per page (for islands not handed the bank). */
export function bankFor(unit: string): Promise<Bank> {
  let p = banks.get(unit);
  if (!p) {
    p = loadBank(unit);
    p.catch(() => banks.delete(unit));
    banks.set(unit, p);
  }
  return p;
}

const metas = new Map<string, Promise<Record<string, ConceptMeta>>>();
/** Concept titles, links and edges for a unit. The pretest JSON carries the same concept map in a few kilobytes,
 *  so it is tried before the full bank. Cached per unit. */
export function conceptsFor(unit: string): Promise<Record<string, ConceptMeta>> {
  let p = metas.get(unit);
  if (!p) {
    p = fetch(`/data/${unit}/pretest.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Bank>) : Promise.reject(new Error(String(r.status)))))
      .then((b) => (b.concepts && Object.keys(b.concepts).length ? b.concepts : Promise.reject(new Error('no concepts'))))
      .catch(() => bankFor(unit).then((b) => b.concepts));
    p.catch(() => metas.delete(unit));
    metas.set(unit, p);
  }
  return p;
}

/** The unit's study aid for one concept: undefined while loading, null when there is none. */
export function useAid(unit: string, concept: string): Aid | null | undefined {
  const [aid, setAid] = useState<Aid | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    setAid(undefined);
    loadAids(unit).then((b) => { if (live) setAid(b.aids[concept] ?? null); });
    return () => { live = false; };
  }, [unit, concept]);
  return aid;
}

const KIND: Record<Confidence, { kind: string; lead: string; text: string }> = {
  sure: { kind: 'misconception', lead: 'A misconception.', text: 'You were sure, so replace the old belief rather than adding a fact beside it.' },
  unsure: { kind: 'half-known', lead: 'Half-known.', text: 'You were unsure: part of it is there, so pin down the part that slipped.' },
  guess: { kind: 'gap', lead: 'A gap.', text: 'You guessed, so this is not learned yet. Nothing to unlearn, just something to learn.' },
};

/** One plain line naming the kind of error from the confidence given before answering. */
export function ErrorKind({ confidence }: { confidence: Confidence }) {
  const k = KIND[confidence];
  return (
    <p className="practice-diag" data-kind={k.kind}>
      <strong>{k.lead}</strong> {k.text}
    </p>
  );
}

/** "Common mistakes on this idea": the concept aid's misconceptions, shown when asked; nothing when there are none. */
export function CommonMistakes({ unit, concept }: { unit: string; concept: string }) {
  const aid = useAid(unit, concept);
  const items = aid?.misconceptions ?? [];
  if (!items.length) return null;
  return (
    <details className="practice-mistakes">
      <summary className="practice-mistakes__summary">Common mistakes on this idea</summary>
      <ul className="practice-mistakes__list">
        {items.map((m, i) => (
          <li key={i} className="practice-mistakes__item">
            <p className="practice-mistakes__claim">{m.claim}</p>
            <p className="practice-mistakes__why"><span className="label">Why it’s tempting</span> {m.tempting}</p>
            <p className="practice-mistakes__fix"><span className="label">Correction</span> {m.correction}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

interface Props {
  unit: string;
  conceptId: string;
  concept?: ConceptMeta;
  /** The unit's concept map, when the caller has it; otherwise fetched lazily (and only if needed). */
  concepts?: Record<string, ConceptMeta>;
}

const SHAKY = 0.6;

/** Where to go after a wrong answer: practise, tell it apart from its look-alike, or repair a prerequisite. */
export function AfterWrong({ unit, conceptId, concept, concepts }: Props) {
  const attempts = useStudy((s) => s.attempts);
  const [map, setMap] = useState<Record<string, ConceptMeta> | undefined>(concepts);
  const contrastId = concept?.contrastsWith?.[0];
  const prereqIds = concept?.dependsOn ?? [];
  const needMap = !concepts && (!!contrastId || prereqIds.length > 0);

  useEffect(() => { startStudySync(); }, []);
  useEffect(() => {
    if (concepts) { setMap(concepts); return; }
    if (!needMap) return;
    let live = true;
    conceptsFor(unit).then((m) => { if (live) setMap(m); }, () => {});
    return () => { live = false; };
  }, [unit, concepts, needMap]);

  const acc = accuracyByConcept(attempts);
  const shaky = prereqIds.find((id) => map?.[id] && (acc.get(id)?.accuracy ?? -1) < SHAKY);
  const prereq = shaky ? map![shaky] : undefined;
  const contrastTitle = contrastId ? map?.[contrastId]?.title : undefined;
  const q = (params: Record<string, string>) => `/${unit}/quiz?${new URLSearchParams(params)}`;

  return (
    <section className="after-wrong" aria-label="Practise next">
      <p className="label after-wrong__label">Next for this idea</p>
      <ul className="after-wrong__list">
        <li><a className="after-wrong__link" data-after="practise" href={q({ concept: conceptId })}>Practise this idea</a></li>
        {contrastId && (
          <li>
            <a className="after-wrong__link" data-after="contrast" href={q({ mode: 'contrast', concept: conceptId })}>
              Tell it apart from {contrastTitle ?? 'the idea it is confused with'}
            </a>
          </li>
        )}
        {prereq && (
          <li>
            <a className="after-wrong__link" data-after="prereq" href={prereq.href}>
              Shaky foundation? {prereq.title} comes first
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
