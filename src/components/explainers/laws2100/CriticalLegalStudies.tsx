/*
SCENE: Critical Legal Studies — three streams feed one river; at its mouth, the key claims and an indeterminacy gauge
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Legal realism, postmodernism and Marxism feed CLS, which sees law as contradictory, illegitimate and
  ideological, with a more radical indeterminacy than the realists'.
SUBJECT: the river line from the three sources to CLS, then the gauge needle.
STEPS: 1 three streams · 2 the river: CLS · 3 key claims · 4 gauge: realist vs CLS indeterminacy · 5 no is/ought split.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Three 108-unit sources on a 360-unit canvas.
Source: concept laws2100-w06-critical-legal-studies (no linked authorities).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const STREAMS = [['legal realism', 'indeterminacy'], ['postmodernism', 'unstable meaning'], ['Marxism', 'superstructure']];
const CLAIMS = ['radical legal indeterminacy', 'contradictory: born of political conflict', 'yet predictable: judges share the status quo', 'law as ideology: legitimises injustice', 'no neutral legal concepts'];

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="Legal realism, postmodernism and Marxism flow into Critical Legal Studies; its key claims; a gauge showing CLS indeterminacy beyond the realists'">
    <g data-step="1">
      {STREAMS.map(([t, d], i) => (
        <g key={t}>
          <rect x={8 + i * 118} y="8" width="108" height="54" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={62 + i * 118} y="31" textAnchor="middle" {...body}>{t}</text>
          <text x={62 + i * 118} y="50" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">{d}</text>
        </g>
      ))}
    </g>
    <g data-step="2">
      {[62, 180, 298].map((x) => <path key={x} d={`M${x} 62 C ${x} 86, 180 80, 180 104`} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />)}
      <rect x="8" y="104" width={W - 16} height="70" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="128" textAnchor="middle" {...head} data-label="cls">CRITICAL LEGAL STUDIES</text>
      <text x={W / 2} y="148" textAnchor="middle" {...body}>law: contradictory and illegitimate,</text>
      <text x={W / 2} y="165" textAnchor="middle" {...body}>maintaining oppressive social relations</text>
    </g>
    <g data-step="3">
      <text x="8" y="204" {...head} fill="var(--ink-2)">KEY CLAIMS</text>
      {CLAIMS.map((c, i) => (
        <g key={c}>
          <circle cx="16" cy={223 + i * 24} r="3" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
          <text x="28" y={228 + i * 24} {...body}>{c}</text>
        </g>
      ))}
    </g>
    <g data-step="4">
      <text x="8" y="366" {...head} fill="var(--ink-2)">INDETERMINACY</text>
      <line x1="16" y1="396" x2={W - 16} y2="396" stroke="var(--ink-3)" strokeWidth="2" />
      <line x1="190" y1="384" x2="190" y2="408" stroke="var(--ink-2)" strokeWidth="2" />
      <text x="190" y="428" textAnchor="middle" {...body} fontSize={12}>realists</text>
      <line x1="318" y1="384" x2="318" y2="408" stroke="var(--ink)" strokeWidth="2" />
      <text x="318" y="428" textAnchor="middle" {...body} fontSize={12}>CLS</text>
      <text x="16" y="428" {...body} fontSize={12} fill="var(--ink-2)">less</text>
    </g>
    <g data-step="5">
      <rect x="8" y="458" width={W - 16} height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="484" {...head} fill="var(--ink-2)">IS / OUGHT</text>
      <text x="22" y="506" {...body}>the separation makes no sense to CLS:</text>
      <text x="22" y="526" {...body}>law mirrors political visions</text>
    </g>
  </svg>
);

export default function CriticalLegalStudies() {
  return (
    <Diagram
      label="Critical Legal Studies: three streams, one river, its key claims and a more radical indeterminacy"
      terms={[
        { term: 'Indeterminacy', def: 'Law does not guide or constrain judicial reasoning to one result.' },
        { term: 'Deconstruction', def: 'The postmodern method: words do not have stable meaning.' },
        { term: 'Superstructure', def: 'For Marx, what helps the dominant class maintain the relations of production — law among it.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Influences: legal realism (law is indeterminate), postmodernism (anti-foundationalist; language constitutes reality) and Marx\'s historical materialism (law legitimises private ownership yet presents itself as neutral).' },
        { caption: 'CLS offers a radical critique of law seen as a coherent and neutral system of rules, of legal institutions, and of liberal legal values: the rule of law, the idea of rights, the legal process.' },
        { caption: 'Key claims: radical indeterminacy; contradiction from political conflict; prediction because judges share a commitment to the status quo; law as ideology; scepticism about neutral concepts.' },
        { caption: 'With realism: law is indeterminate and legal reasoning a myth. Beyond realism: a more radical indeterminacy, and more interest in the politics and ideology of law.' },
        { caption: 'The is/ought separation makes no sense to CLS. Test each claim against Hart\'s or Dworkin\'s reply.' },
      ]}
      check={{
        question: 'Where does CLS go beyond legal realism?',
        options: [
          { text: 'It says law is indeterminate', why: 'Realists say that too; CLS shares the claim with realism.' },
          { text: 'It claims a more radical indeterminacy and reads law as ideology mirroring political visions', correct: true, why: 'CLS takes from postmodernism that words lack stable meaning and from Marxism that law serves the powerful.' },
          { text: 'It denies that decisions can ever be predicted', why: 'CLS says decisions may be predicted, because judges share a commitment to the status quo.' },
        ],
      }}
    />
  );
}
