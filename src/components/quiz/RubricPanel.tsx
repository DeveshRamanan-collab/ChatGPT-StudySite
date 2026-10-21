// Marking Criteria panel: rows expand in place to show top-band text and the marker's margin note; a tick per row
// self-marks and the score updates live. The open (or hovered) row highlights its matching model sentences.
import { useId, useState } from 'react';
import { rubricScore } from '../../lib/match';
import type { RubricRow } from './types';

interface Props {
  rows: RubricRow[];
  ticked: Set<string>;
  onTick: (id: string, on: boolean) => void;
  onFocusRow: (id: string | null) => void;
}

export function RubricPanel({ rows, ticked, onTick, onFocusRow }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const { got, total } = rubricScore(rows, ticked);
  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    onFocusRow(next);
  };
  return (
    <section className="rubric" aria-labelledby={`${uid}-h`}>
      <div className="rubric__head">
        <h3 id={`${uid}-h`} className="rubric__title">Marking criteria</h3>
        <p className="rubric__score" aria-live="polite"><span className="mono" data-score>{got}</span> / {total}</p>
      </div>
      <ol className="rubric__rows">
        {rows.map((r) => (
          <li key={r.id} className="rubric__row" data-open={open === r.id || undefined} data-ticked={ticked.has(r.id) || undefined}
              onMouseEnter={() => open === null && onFocusRow(r.id)} onMouseLeave={() => open === null && onFocusRow(null)}>
            <div className="rubric__line">
              <input
                type="checkbox"
                id={`${uid}-${r.id}`}
                className="rubric__tick"
                checked={ticked.has(r.id)}
                onChange={(e) => onTick(r.id, e.currentTarget.checked)}
                aria-label={`I did this: ${r.criterion}`}
              />
              <button type="button" className="rubric__crit" aria-expanded={open === r.id} aria-controls={`${uid}-${r.id}-d`} onClick={() => toggle(r.id)}>
                <span>{r.criterion}</span>
                <span className="rubric__marks mono">{r.marks}</span>
              </button>
            </div>
            <div className="rubric__detail" id={`${uid}-${r.id}-d`} hidden={open !== r.id}>
              <p><span className="label">Top band</span> {r['top-band']}</p>
              <p className="margin-note"><span className="label">In the margin</span> {r['margin-note']}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
