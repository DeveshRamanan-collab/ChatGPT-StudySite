// Shared pieces of the decision-flow islands: what a node is called, how an outcome's tone reads (text + shape,
// never colour alone), and a node's note with its case / authority chips and concept link ("Why?").
import type { FlowNode } from '../../lib/flow';

/** Names resolved at build time; a reference with no entry renders as plain text, never a dead link. */
export interface FlowRefs {
  cases: Record<string, string>;
  authorities: Record<string, string>;
  concepts: Record<string, { title: string; href: string }>;
}

export const TONE = {
  met: { glyph: '✓', word: 'Met' },
  'not-met': { glyph: '✕', word: 'Not met' },
  qualified: { glyph: '~', word: 'Qualified' },
} as const;
export const toneOf = (n: FlowNode) => (n.tone ? TONE[n.tone] : { glyph: '•', word: 'Outcome' });

export const kindWord = (n: FlowNode) => (n.kind === 'ask' ? 'Question' : n.kind === 'step' ? 'Step' : 'Outcome');

const humanise = (id: string) => id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

export const hasDetail = (n: FlowNode, refs: FlowRefs) =>
  !!(n.note || n.cases.length || n.authorities.length || (n.concept && refs.concepts[n.concept]));

export function NodeDetail({ node, refs }: { node: FlowNode; refs: FlowRefs }) {
  const concept = node.concept ? refs.concepts[node.concept] : undefined;
  const chips = node.cases.length + node.authorities.length > 0;
  return (
    <div className="flow-note">
      {node.note && <p className="flow-note__text">{node.note}</p>}
      {chips && (
        <p className="flow-note__chips">
          {node.cases.map((id) =>
            refs.cases[id] ? (
              <a key={id} className="chip chip--case" href={`/cases/${id}`}>{refs.cases[id]}</a>
            ) : (
              <span key={id} className="flow-note__ref">{humanise(id)}</span>
            ),
          )}
          {node.authorities.map((id) =>
            refs.authorities[id] ? (
              <a key={id} className="chip" href={`/authorities/${id}`}>{refs.authorities[id]}</a>
            ) : (
              <span key={id} className="flow-note__ref">{humanise(id)}</span>
            ),
          )}
        </p>
      )}
      {concept && (
        <p className="flow-note__concept">
          <span className="label">Concept</span> <a href={concept.href}>{concept.title}</a>
        </p>
      )}
    </div>
  );
}
