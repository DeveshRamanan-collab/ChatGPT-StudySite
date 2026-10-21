// IRAC self-check (feature 159), shown with the marking step of a problem question: four plain prompts (issues raised,
// rules with an authority, essential facts used, a conclusion per issue) from the heuristics in src/lib/irac.ts.
// A prompt to look again before self-marking, never a mark. The fact check appears only when the question has a
// problem-fact annotation.
import { useEffect, useId, useMemo, useState } from 'react';
import { loadAids, type Facts } from '../../lib/aids';
import { deslug, iracCheck } from '../../lib/irac';
import { bankFor } from './AfterWrong';
import type { CasePair, LongQ } from './types';
import '../../styles/practice.css';

interface Props { q: LongQ; text: string; cases?: CasePair[] }

const clip = (s: string, n = 140) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

interface Item { key: string; label: string; ok: boolean; line: string; more?: { summary: string; items: string[] } }

export function IracCheck({ q, text, cases }: Props) {
  const uid = useId();
  const [names, setNames] = useState<string[]>(() => (cases ?? []).map((c) => c.name));
  const [facts, setFacts] = useState<Facts | null>(null);

  useEffect(() => {
    let live = true;
    loadAids(q.unit).then((b) => { if (live) setFacts(b.facts[q.id] ?? null); });
    return () => { live = false; };
  }, [q.unit, q.id]);
  useEffect(() => {
    if (cases) { setNames(cases.map((c) => c.name)); return; }
    let live = true;
    bankFor(q.unit).then((b) => { if (live) setNames(b.cases.map((c) => c.name)); }, () => {});
    return () => { live = false; };
  }, [q.unit, cases]);

  const report = useMemo(
    () =>
      iracCheck({
        text,
        rubric: q.rubric,
        caseNames: [...names, ...(q.cases ?? []).map(deslug)],
        facts: facts?.facts,
        issues: facts?.issues,
        parties: facts?.parties?.map((p) => p.name),
      }),
    [text, q, names, facts],
  );

  const items: Item[] = [];
  const raised = report.issues.filter((i) => i.addressed).length;
  items.push({
    key: 'issue',
    label: 'Issue',
    ok: raised === report.issues.length,
    line: raised === report.issues.length
      ? 'Every marking point shows up in your answer.'
      : `${raised} of ${report.issues.length} marking points show up in your answer.`,
    more: { summary: 'Not obviously there', items: report.issues.filter((i) => !i.addressed).map((i) => i.label) },
  });

  const cited = report.rules.filter((r) => r.authority).length;
  items.push({
    key: 'rule',
    label: 'Rule',
    ok: report.rules.length > 0 && cited === report.rules.length,
    line: !report.rules.length
      ? 'No rule statements spotted. Does each issue state its law?'
      : cited === report.rules.length
        ? 'Every rule you state names a case or section.'
        : `${cited} of ${report.rules.length} rule statements name a case or section.`,
    more: { summary: 'Without an authority', items: report.rules.filter((r) => !r.authority).map((r) => clip(r.sentence)) },
  });

  if (report.facts.checked) {
    const m = report.facts.missed.length;
    items.push({
      key: 'application',
      label: 'Application',
      ok: m === 0,
      line: m === 0 ? 'You use every essential fact.' : `${m} essential ${plural(m, 'fact never appears', 'facts never appear')} in your answer.`,
      more: { summary: plural(m, 'Which fact', 'Which facts'), items: report.facts.missed },
    });
  }

  const concluded = report.conclusions.filter((c) => c.concluded).length;
  items.push({
    key: 'conclusion',
    label: 'Conclusion',
    ok: report.conclusions.length > 0 && concluded === report.conclusions.length,
    line: !report.conclusions.length
      ? 'No issue reaches a conclusion yet.'
      : concluded === report.conclusions.length
        ? 'Each issue you raise reaches a conclusion.'
        : `${concluded} of ${report.conclusions.length} issues reach a conclusion.`,
    more: { summary: 'Still open', items: report.conclusions.filter((c) => !c.concluded).map((c) => c.label) },
  });

  return (
    <section className="irac-check" aria-labelledby={`${uid}-h`} data-irac>
      <h3 className="irac-check__title" id={`${uid}-h`}>Before you mark: a quick look</h3>
      <p className="irac-check__lede">This is a prompt to look again, not a mark.</p>
      <ul className="irac-check__list">
        {items.map((it) => (
          <li key={it.key} className="irac-check__item" data-check={it.key} data-ok={it.ok || undefined}>
            <span className="irac-check__mark" aria-hidden="true">{it.ok ? '✓' : '○'}</span>
            <div className="irac-check__body">
              <p className="irac-check__line">
                <span className="irac-check__name">{it.label}</span>
                <span className="visually-hidden">{it.ok ? ' (looks fine): ' : ' (look again): '}</span>
                <span aria-hidden="true"> · </span>
                {it.line}
              </p>
              {it.more && it.more.items.length > 0 && (
                <details className="irac-check__more">
                  <summary className="irac-check__summary">{it.more.summary}</summary>
                  <ul className="irac-check__items">{it.more.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </details>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
