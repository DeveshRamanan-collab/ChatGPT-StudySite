/*
SCENE: Naffine — aims, methods and epistemology of legal feminism, in four rows that build down the page
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Feminist legal theory challenges law's claim to impartiality, uses methods that join theory and practice
  (consciousness raising → naming → recognition → new categories), and speaks from the position of the outsider
  within, with a generous, revisable epistemology of largess set against the jurisprudence of orthodoxy.
SUBJECT: beat 1 the scale beam (rotate, scrubbed); beat 2 the method chain; beat 3 the figure stepping onto the
  boundary (translate); beat 4 the open frame beside the closed one.
BEAT 1 (0–25%): "impartial, objective" — four examples arrive and the beam tips. BEAT 2 (25–50%): the four methods
  light in order. BEAT 3 (50–75%): the outsider within moves from outside onto the boundary. BEAT 4 (75–100%):
  largess (open, revisable) beside orthodoxy (closed).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only, ease none (scrubbed).
Source: concept laws2100-w08-naffine-in-praise-of-legal-feminism; authority naffine-in-praise-of-legal-feminism;
  week 8 notes (slides 13–15; transcript on Kelsen's pure theory).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const EXAMPLES = ['sexual assault law', 'the defence of provocation', 'the marital rape exception', 'reluctance to intervene in domestic violence'];
const METHODS = ['consciousness raising', 'naming and re-naming the injury', 'legal recognition of the injury', "new legal categories, eg 'sexual harassment'"];

function scene(t: number) {
  const b1 = clamp(t), b2 = clamp(t - 1), b3 = clamp(t - 2), b4 = clamp(t - 3);
  const tilt = 10 * clamp(b1 * 1.4 - 0.3);
  const step = clamp(b3 * 1.4 - 0.2);
  return (
    <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Law's claimed impartiality tips under four examples; four feminist methods in sequence; the outsider within on the boundary; largess beside orthodoxy">
      {/* Row 1: law's claim to impartiality */}
      <text x="8" y="18" {...head}>LAW CLAIMS: IMPARTIAL, OBJECTIVE</text>
      <line x1="180" y1="44" x2="180" y2="104" stroke="var(--ink-2)" strokeWidth="2" />
      <path d="M160 108 L200 108" stroke="var(--ink-2)" strokeWidth="2" />
      <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '180px 44px' }}>
        <line x1="100" y1="44" x2="260" y2="44" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 44 L86 74 L114 74 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M260 44 L246 74 L274 74 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      {EXAMPLES.map((e, i) => (
        <text key={e} x="8" y={132 + i * 18} {...body} fontSize={12} opacity={clamp(b1 * 4 - i)}>{`· ${e}`}</text>
      ))}
      {/* Row 2: methods */}
      <g opacity={b2 > 0 ? 1 : 0}>
        <text x="8" y="226" {...head}>METHODS: THEORY AND PRACTICE</text>
        {METHODS.map((m, i) => (
          <g key={m} opacity={clamp(b2 * 4 - i + 0.3)}>
            <circle cx="18" cy={248 + i * 24} r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <text x="18" y={252 + i * 24} textAnchor="middle" {...head} fill="var(--ink)">{i + 1}</text>
            <text x="34" y={253 + i * 24} {...body} fontSize={12}>{m}</text>
          </g>
        ))}
      </g>
      {/* Row 3: the outsider within */}
      <g opacity={b3 > 0 ? 1 : 0}>
        <text x="8" y="366" {...head}>THE OUTSIDER WITHIN (P 77)</text>
        <rect x="150" y="380" width="202" height="76" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="251" y="404" textAnchor="middle" {...body} fontSize={12}>law and legal theory</text>
        <text x="40" y="474" textAnchor="middle" {...head}>STRANGER</text>
        <text x="300" y="474" textAnchor="middle" {...head}>NATIVE</text>
        <g style={{ transform: `translateX(${110 * step}px)` }}>
          <circle cx="40" cy="418" r="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="40" cy="418" r="3" fill="var(--ink)" />
        </g>
        <text x="251" y="428" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)" opacity={step}>epistemic privilege</text>
        <text x="251" y="446" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)" opacity={step}>of marginality</text>
      </g>
      {/* Row 4: largess vs orthodoxy */}
      <g opacity={b4 > 0 ? 1 : 0}>
        <text x="8" y="500" {...head}>EPISTEMOLOGY (P 81)</text>
        <g opacity={clamp(b4 * 2)}>
          <path d="M8 520 L8 590 L166 590 L166 520 L120 520 M54 520 L8 520" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="5 4" />
          <path d="M87 506 L87 540 M80 532 L87 541 L94 532" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
          <text x="87" y="560" textAnchor="middle" {...body} fontSize={12}>largess</text>
          <text x="87" y="578" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">open, revisable</text>
        </g>
        <g opacity={clamp(b4 * 2 - 1)}>
          <rect x="194" y="520" width="158" height="70" rx="2" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
          <text x="273" y="552" textAnchor="middle" {...body} fontSize={12}>the jurisprudence</text>
          <text x="273" y="570" textAnchor="middle" {...body} fontSize={12}>of orthodoxy</text>
        </g>
      </g>
    </svg>
  );
}

export default function NaffineInPraiseOfLegalFeminism() {
  return (
    <ScrollExplainer
      label="Naffine on legal feminism: law's claimed impartiality, four methods, the outsider within, largess versus orthodoxy"
      terms={[
        { term: 'Consciousness raising', def: 'The first of the feminist methods Naffine lists, before naming injuries and securing their legal recognition.' },
        { term: 'Outsider within', def: 'Naffine: feminist legal theorists are "neither stranger nor native" to law and legal theory.' },
        { term: 'Epistemology of largess', def: 'A generous methodology: receptive of other bodies of knowledge and open to revision.' },
      ]}
      beats={[
        { caption: 'Aims: investigate and challenge the ways the law is not impartial and objective (and, when it appears impartial, is not applied equally): sexual assault law, provocation, the marital rape exception, reluctance to intervene in domestic violence.' },
        { caption: 'Methods join theory and practice: consciousness raising; naming and re-naming the injuries done to women; their legal recognition. Result: new categories such as sexual harassment, date rape and domestic violence. Ask why Kelsen would not use them.' },
        { caption: 'Feminist legal theorists are "neither stranger nor native"; they are the outsider within (p 77), with an "epistemic privilege of marginality": a particular perspective on the deficiencies of law.' },
        { caption: 'Largess versus "the jurisprudence of orthodoxy": "a willingness to concede that new points of view might be better than well-used ones; that one’s view is necessarily limited, partial, and so consistently in need of revision" (p 81).' },
      ]}
      scene={scene}
      check={{
        question: 'What does Naffine’s "epistemology of largess" involve?',
        options: [
          { text: 'Strict limits on what counts as acceptable knowledge for a legal inquiry', why: 'That describes the closed approach she calls the jurisprudence of orthodoxy, or Kelsen’s pure theory, not largess.' },
          { text: 'Openness to other bodies of knowledge, and to revising one’s own view', correct: true, why: 'Largess concedes that new points of view might be better than well-used ones, since one’s view is limited and partial.' },
          { text: 'Generosity to accused women when criminal defences are applied', why: 'Largess is about method and knowledge, not about how defences are applied to accused persons.' },
        ],
      }}
    />
  );
}
