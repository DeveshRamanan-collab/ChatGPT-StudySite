/*
SCENE: General principles of law — the keystone that plugs the gap between the treaty and custom pillars
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: General principles (art 38(1)(c)) are a last resort: they fill the gap only when neither a treaty nor custom
  resolves the dispute, and only if widely recognised and transposable.
SUBJECT: the keystone, which drops into the gap only after both pillars fall short.
BEAT 1 (0–25%): treaty and custom pillars with an open arch.
BEAT 2 (25–50%): the gap outlined — neither source resolves the dispute.
BEAT 3 (50–75%): keystone drops in (translateY + opacity, scrubbed, ease none); examples listed.
BEAT 4 (75–100%): the test — geographical spread across legal traditions; usefully implemented internationally; equity.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (keystone in place) with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w02-general-principles-of-law.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));

function Pillar({ x, label }: { x: number; label: string }) {
  return (
    <>
      <rect x={x} y="110" width="60" height="150" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 30} y="190" textAnchor="middle" {...ui} fontSize="11.5">{label}</text>
    </>
  );
}

function scene(t: number) {
  const drop = on(t, 2);
  return (
    <svg viewBox="0 0 360 420" style={{ maxWidth: 440 }} role="img" aria-label="Treaty and custom pillars with a gap in the arch, plugged by a general-principles keystone">
      <Pillar x={40} label="TREATY" />
      <Pillar x={260} label="CUSTOM" />
      <path d="M 40 110 L 40 80 L 150 60 L 156 96 L 100 110 Z" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M 320 110 L 320 80 L 210 60 L 204 96 L 260 110 Z" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <g style={{ opacity: on(t, 1) * (1 - drop) }}>
        <path d="M 150 60 L 210 60 L 204 96 L 156 96 Z" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="180" y="140" textAnchor="middle" {...note} fill="var(--ink)">a dispute that</text>
        <text x="180" y="158" textAnchor="middle" {...note} fill="var(--ink)">neither source</text>
        <text x="180" y="176" textAnchor="middle" {...note} fill="var(--ink)">resolves</text>
      </g>
      <g style={{ opacity: drop, transform: `translateY(${(1 - drop) * -50}px)` }}>
        <path d="M 150 60 L 210 60 L 204 96 L 156 96 Z" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="2" />
        <text x="180" y="30" textAnchor="middle" {...ui}>GENERAL PRINCIPLES</text>
        <text x="180" y="48" textAnchor="middle" {...note} fontSize="12">art 38(1)(c)</text>
      </g>
      <g style={{ opacity: drop }}>
        <text x="180" y="290" textAnchor="middle" {...note} fill="var(--ink)">equity · good faith · res judicata ·</text>
        <text x="180" y="308" textAnchor="middle" {...note} fill="var(--ink)">impartiality of judges</text>
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="326" width="344" height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="350" {...ui}>TO COUNT AS A GENERAL PRINCIPLE</text>
        <text x="22" y="372" {...note}>recognised across civil law, common law</text>
        <text x="22" y="390" {...note}>and other traditions, and usefully</text>
        <text x="22" y="408" {...note}>implemented at the international level</text>
      </g>
    </svg>
  );
}

export default function GeneralPrinciplesOfLaw() {
  return (
    <ScrollExplainer
      label="General principles of law as a keystone filling the gap left by treaty and custom"
      terms={[
        { term: 'General principles', def: '“The general principles of law recognized by civilized nations” (art 38(1)(c)).' },
        { term: 'Equity', def: 'What is fair and reasonable in the administration of justice.' },
        { term: 'Gap-filler', def: 'Used only when a dispute cannot be effectively resolved by a treaty or custom.' },
      ]}
      beats={[
        { caption: 'Two pillars first: an applicable treaty, and an applicable rule of customary international law.' },
        { caption: 'Sometimes a dispute cannot be effectively resolved on either: the arch has a gap.' },
        { caption: 'General principles fill it — principles common to domestic systems generally, transposed to the international level: equity, good faith, res judicata, the impartiality of judges.' },
        { caption: 'A principle needs a decent geographical spread across legal traditions and must work internationally. Equity is the working example: the ICJ uses it in maritime delimitation where mechanical application of a rule would be unfair.' },
      ]}
      scene={scene}
      check={{
        question: 'When should an answer reach for a general principle of law?',
        options: [
          { text: 'First, because general principles are the most universal source', why: 'They are a last resort, not a first port of call.' },
          { text: 'Only after ruling out both an applicable treaty and an applicable customary rule', correct: true, why: 'Courts rely on general principles when a dispute cannot be resolved by treaty or custom.' },
          { text: 'Whenever one legal family’s domestic law recognises the principle', why: 'It needs recognition across civil law, common law and other traditions, and must transpose internationally.' },
        ],
      }}
    />
  );
}
