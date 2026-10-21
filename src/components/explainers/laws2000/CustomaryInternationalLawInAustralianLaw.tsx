/*
SCENE: Customary international law in Australian law — two paths to the common law, one wall across both
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Whether by incorporation or transformation, a customary rule cannot enter where inconsistent with statute or
  essential common law doctrine — and a criminal norm needs legislation first.
SUBJECT: the wall across both paths.
BEAT 1 (0–25%): the customary rule and its two paths, incorporation and transformation.
BEAT 2 (25–50%): the wall rises across both (scaleY from its base, scrubbed, ease none).
BEAT 3 (50–75%): a criminal norm (genocide) drops toward the common law and stops at a bar: legislation first.
BEAT 4 (75–100%): influence — "march in step" (Mabo) but no "back door" (Teoh).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w05-customary-international-law-in-australian-law; Nulyarimma v Thompson; Mabo (No 2); Teoh.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 11.5, letterSpacing: 1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

function scene(t: number) {
  const wall = on(t, 1), crime = on(t, 2);
  return (
    <svg viewBox="0 0 360 450" style={{ maxWidth: 440 }} role="img" aria-label="A customary rule's two paths to the common law, both blocked by a wall of inconsistent statute and essential common law doctrine">
      <g style={{ opacity: on(t, 0) }}>
        <rect x="110" y="12" width="140" height="40" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="37" textAnchor="middle" {...ui}>CUSTOMARY RULE</text>
        <path d="M 130 52 V 70 H 40 V 236" {...ink} />
        <path d="M 230 52 V 70 H 320 V 236" {...ink} />
        <text x="52" y="92" {...ui}>INCORPORATION</text>
        {['automatic source,', 'unless a rule', 'to the contrary'].map((l, i) => <text key={l} x="52" y={110 + i * 16} {...note}>{l}</text>)}
        <text x="308" y="92" textAnchor="end" {...ui}>TRANSFORMATION</text>
        {['only once formally', 'adopted by Parliament', 'or the courts'].map((l, i) => <text key={l} x="308" y={110 + i * 16} textAnchor="end" {...note}>{l}</text>)}
        <rect x="16" y="300" width="328" height="36" rx="8" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="180" y="323" textAnchor="middle" {...ui}>AUSTRALIAN COMMON LAW</text>
      </g>
      <g style={{ opacity: wall, transform: `scaleY(${0.2 + 0.8 * wall})`, transformOrigin: '180px 284px' }}>
        <rect x="16" y="238" width="328" height="46" rx="4" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="180" y="257" textAnchor="middle" {...ui}>INCONSISTENT STATUTE ·</text>
        <text x="180" y="275" textAnchor="middle" {...ui}>ESSENTIAL COMMON LAW DOCTRINE</text>
      </g>
      <g style={{ opacity: crime }}>
        <g style={{ transform: `translateY(${crime * 26}px)` }}>
          <rect x="112" y="162" width="136" height="26" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="180" y="180" textAnchor="middle" {...note} fill="var(--ink)">genocide (criminal)</text>
        </g>
        <line x1="104" y1="222" x2="256" y2="222" stroke="var(--ink)" strokeWidth="3" />
        <text x="180" y="158" textAnchor="middle" {...note} fill="var(--ink)">legislation first</text>
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <text x="16" y="370" {...note} fill="var(--ink)">a legitimate influence: it may “march in step”</text>
        <text x="16" y="388" {...note}>with the common law (Brennan J, Mabo (No 2))</text>
        <text x="16" y="414" {...note} fill="var(--ink)">but not “a back door means of importing</text>
        <text x="16" y="432" {...note}>an unincorporated convention” (Teoh)</text>
      </g>
    </svg>
  );
}

export default function CustomaryInternationalLawInAustralianLaw() {
  return (
    <ScrollExplainer
      label="Customary international law in Australian law: two paths, one wall"
      terms={[
        { term: 'Incorporation', def: 'Customary international law is automatically a source of Australian law, unless there is a rule to the contrary.' },
        { term: 'Transformation', def: 'Custom becomes Australian law only when formally adopted by Parliament or the courts.' },
        { term: 'Jus cogens', def: 'A peremptory norm, such as the prohibition of genocide.' },
      ]}
      beats={[
        { caption: 'The position on custom is less settled than for treaties. Two doctrines compete — transformation and incorporation — and Australia has not clearly adopted either: both have been recognised in High Court decisions.' },
        { caption: 'Either way, a customary rule cannot generally be adopted where it is inconsistent with domestic legislation or essential common law doctrine.' },
        { caption: 'Nulyarimma v Thompson: even if genocide is customary law, and its prohibition jus cogens, it is not part of Australian law without legislation declaring it a crime — criminal norms are different (Wilcox J). Merkel J, dissenting: general acceptance, reception (no inconsistency), then a true declaration of the common law from the date the rule was established.' },
        { caption: 'International law is a legitimate influence on the common law — it may “march in step” (Brennan J, Mabo (No 2)) — but not “a back door means of importing an unincorporated convention” (Mason CJ and Deane J, Teoh).' },
      ]}
      scene={scene}
      check={{
        question: 'Applicants ask an Australian court to try an alleged genocide as a crime under customary international law, with no Australian legislation. On Nulyarimma, what happens?',
        options: [
          { text: 'It can be tried — incorporation makes custom part of Australian law', why: 'The Federal Court held criminal norms different: legislation declaring the crime comes first.' },
          { text: 'It cannot be tried without legislation declaring it a crime', correct: true, why: 'Wilcox J: even accepting the prohibition is jus cogens, it is not part of Australian law without legislation.' },
          { text: 'It can be tried because the prohibition is jus cogens', why: 'The Court accepted it may be jus cogens and still required legislation.' },
        ],
      }}
    />
  );
}
