// The 20-second terms beat every explainer opens with: the three to five words the explainer relies on.
export interface Term { term: string; def: string }

export function TermsBeat({ terms, onStart }: { terms: Term[]; onStart?: () => void }) {
  return (
    <section className="xterms" aria-label="Terms first">
      <p className="label">Terms first · 20 seconds</p>
      <dl className="xterms__list">
        {terms.map((t) => (
          <div key={t.term} className="xterms__item"><dt>{t.term}</dt><dd>{t.def}</dd></div>
        ))}
      </dl>
      {onStart && <button type="button" className="btn btn--primary btn--sm" onClick={onStart}>Start</button>}
    </section>
  );
}
