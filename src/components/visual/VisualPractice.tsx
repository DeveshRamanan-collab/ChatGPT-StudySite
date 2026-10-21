// Visual practice shell (/<unit>/visual; features 92, 97, 98, 99): four exercise kinds as tabs, each scoped by a
// week picker, all built from the unit's study aids. Kind and week live in the address (?kind=match&week=3) so a
// reload or a shared link lands in the same place. Concepts without the material a kind needs are skipped, and the
// page says so plainly; a unit with no aids at all gets one quiet sentence.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from 'react';
import { loadAids, type Aid, type AidsBundle, type Flow } from '../../lib/aids';
import { availability, KIND_LABEL, pickParam, VISUAL_KINDS, weekAids, type ConceptRef, type VisualKind, type WeekRef } from '../../lib/visual';
import LabelDrag from './LabelDrag';
import MatchUp from './MatchUp';
import SortInto from './SortInto';
import SketchPad from './SketchPad';
import '../../styles/visual.css';

export interface PanelProps { unit: string; week: WeekRef; aids: Aid[]; flows: Flow[]; concepts: Record<string, ConceptRef> }

interface Props { unit: string; code: string; weeks: WeekRef[]; concepts: Record<string, ConceptRef> }

const NONE: Record<VisualKind, (n: number) => string> = {
  label: (n) => `No rule in Week ${n} has its parts listed yet.`,
  match: (n) => `Week ${n} does not have scenarios for two or more concepts yet, so there is nothing to match.`,
  sort: (n) => `Week ${n} does not have key terms for two or more concepts yet, so there is nothing to sort.`,
  sketch: (n) => `No concept in Week ${n} has its parts or a decision flow to compare a sketch with yet.`,
};

const INTRO: Record<VisualKind, string> = {
  label: 'Each box is one requirement of the rule, in order. Drag each part into its box, or tap a part and then a box.',
  match: 'Link each scenario to the concept it tests: choose a scenario, then a concept. A concept can take more than one.',
  sort: 'Sort each term into the concept it belongs to: drag it, or tap the term and then the concept.',
  sketch: 'Sketch from memory first, then compare with the reference and rate how close you were.',
};

export default function VisualPractice({ unit, code, weeks, concepts }: Props) {
  const uid = useId();
  const [bundle, setBundle] = useState<AidsBundle | null>(null);
  const [kind, setKind] = useState<VisualKind>('label');
  const [weekNo, setWeekNo] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    loadAids(unit).then((b) => { if (live) setBundle(b); });
    const q = new URLSearchParams(location.search);
    setKind(pickParam(q.get('kind'), VISUAL_KINDS, 'label'));
    const w = Number(q.get('week'));
    if (Number.isInteger(w) && w > 0) setWeekNo(w);
    return () => { live = false; };
  }, [unit]);

  const withAids = useMemo(
    () => (bundle ? weeks.filter((w) => Object.values(bundle.aids).some((a) => a.week === w.id)) : []),
    [bundle, weeks],
  );
  const week = withAids.find((w) => w.number === weekNo) ?? withAids[0];
  const aids = useMemo(() => (bundle && week ? weekAids(bundle.aids, week.id, week.concepts) : []), [bundle, week]);
  const flows = useMemo(() => (bundle && week ? bundle.flows.filter((f) => f.week === week.id) : []), [bundle, week]);
  const counts = useMemo(() => availability(aids, flows), [aids, flows]);

  const sync = (k: VisualKind, w: number | undefined) => {
    try {
      const u = new URL(location.href);
      u.searchParams.set('kind', k);
      if (w) u.searchParams.set('week', String(w));
      history.replaceState(history.state, '', u);
    } catch { /* the address is a convenience only */ }
  };
  const pickKind = (k: VisualKind) => { setKind(k); sync(k, week?.number); };
  const pickWeek = (n: number) => { setWeekNo(n); sync(kind, n); };

  // Tabs: roving tabindex, arrows / Home / End; the indicator moves by transform only.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const active = VISUAL_KINDS.indexOf(kind);
  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active, bundle]);
  const tabKey = (e: RKeyboardEvent, i: number) => {
    const n = VISUAL_KINDS.length;
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pickKind(VISUAL_KINDS[next]);
    tabRefs.current[next]?.focus();
  };

  if (!bundle) return <p className="vis__msg" aria-busy="true">Loading study aids…</p>;
  if (!week) {
    return (
      <p className="vis__msg" data-vis-empty>
        No study aids for {code} yet, so there is nothing to practise here. Exercises appear as each week's material is processed.
      </p>
    );
  }

  const panel: PanelProps = { unit, week, aids, flows, concepts };
  return (
    <div className="vis" data-kind={kind} data-focus-keep>
      <div className="tabs__list vis__tabs" role="tablist" aria-label="Exercise">
        {VISUAL_KINDS.map((k, i) => (
          <button
            key={k}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            className="tabs__tab"
            role="tab"
            id={`${uid}-tab-${k}`}
            aria-selected={kind === k}
            aria-controls={`${uid}-panel`}
            tabIndex={kind === k ? 0 : -1}
            onClick={() => pickKind(k)}
            onKeyDown={(e) => tabKey(e, i)}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
        <span className="tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})`, opacity: bar.w ? 1 : 0 }} />
      </div>

      <div className="vis__weeks" role="group" aria-label="Week">
        <span className="vis__weeks-label label" aria-hidden="true">Week</span>
        {withAids.map((w) => (
          <button key={w.id} type="button" className="chip" aria-pressed={w.id === week.id} aria-label={`Week ${w.number}: ${w.topic}`} onClick={() => pickWeek(w.number)}>
            {w.number}
          </button>
        ))}
      </div>
      {withAids.length < weeks.length && (
        <p className="vis__note">
          {weeks.length - withAids.length === 1 ? 'One week has' : `${weeks.length - withAids.length} weeks have`} no study aids yet, so {weeks.length - withAids.length === 1 ? 'it is' : 'they are'} not listed.
        </p>
      )}

      <div className="vis__panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${kind}`} key={`${kind}-${week.id}`}>
        <p className="vis__scope"><span className="mono">Week {week.number}</span> · {week.topic}</p>
        {counts[kind] === 0 ? (
          <p className="vis__msg" data-vis-none>{NONE[kind](week.number)} Try another week or another exercise.</p>
        ) : (
          <>
            <p className="vis__intro">{INTRO[kind]}</p>
            {kind === 'label' && <LabelDrag {...panel} />}
            {kind === 'match' && <MatchUp {...panel} />}
            {kind === 'sort' && <SortInto {...panel} />}
            {kind === 'sketch' && <SketchPad {...panel} />}
          </>
        )}
      </div>
    </div>
  );
}
