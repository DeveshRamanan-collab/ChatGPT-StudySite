/*
SCENE: Defining international law — three definitions, each insisting on something different
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Show what each working definition insists on — who (AG), voluntariness (Practitioner's Guide), the source of
  obligation (Lotus) — and turn them into the exam answer's two moves.
SUBJECT: the "insists on" line of each panel as it arrives.
BEAT 1 (0–25%): AG's panel fades in (opacity, scrubbed, ease none); caption: functional, who it is for.
BEAT 2 (25–50%): Practitioner's Guide panel; caption: voluntary, consent-based.
BEAT 3 (50–75%): Lotus panel; caption: free will; restrictions not presumed.
BEAT 4 (75–100%): the two moves appear beneath; the AG and Lotus panels (their sources) turn ink-bordered.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w01-defining-international-law; case card ss-lotus-france-v-turkey.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));

const PANELS = [
  { h: 'AG’S OFFICE OF INTERNATIONAL LAW', k: 'WHO it is for', q: ['“rules and principles which facilitate the', 'conduct of states and international', 'organisations in their relations …”'] },
  { h: 'PRACTITIONER’S GUIDE', k: 'VOLUNTARINESS', q: ['states “recognise international law as ‘law’', 'by voluntarily consenting and adhering', 'to agreed standards”'] },
  { h: 'PCIJ · S.S. LOTUS', k: 'SOURCE OF OBLIGATION', q: ['rules “emanate from [states’] own free will”;', '“restrictions upon the independence of', 'States cannot therefore be presumed”'] },
];

function scene(t: number) {
  return (
    <svg viewBox="0 0 360 470" style={{ maxWidth: 440 }} role="img" aria-label="Three definitions of international law and the two moves they give an exam answer">
      {PANELS.map((p, i) => {
        const y = 8 + i * 120;
        return (
          <g key={p.h} style={{ opacity: on(t, i) }}>
            <rect x="8" y={y} width="344" height="110" rx="12" fill="var(--paper)" stroke={t >= 3 && i !== 1 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
            <text x="22" y={y + 22} {...ui}>{p.h}</text>
            <text x="22" y={y + 42} {...note} fill="var(--ink)">insists on: <tspan fontWeight="600">{p.k}</tspan></text>
            {p.q.map((l, j) => <text key={l} x="22" y={y + 64 + j * 17} {...note} fontStyle="italic">{l}</text>)}
          </g>
        );
      })}
      <g style={{ opacity: on(t, 3) }}>
        {[{ x: 8, a: 'MOVE 1', b: ['who does the rule', 'address?'] }, { x: 184, a: 'MOVE 2', b: ['which convention or', 'usage binds?'] }].map((m) => (
          <g key={m.a}>
            <rect x={m.x} y="378" width="168" height="80" rx="10" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={m.x + 84} y="400" textAnchor="middle" {...ui}>{m.a}</text>
            {m.b.map((l, j) => <text key={l} x={m.x + 84} y={422 + j * 18} textAnchor="middle" {...note} fill="var(--ink)">{l}</text>)}
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function DefiningInternationalLaw() {
  return (
    <ScrollExplainer
      label="Three definitions of public international law and what each insists on"
      terms={[
        { term: 'Subjects and addressees', def: 'Who international law is for: states, international organisations, sometimes individuals, groups and companies.' },
        { term: 'Consent', def: 'States recognise international law as law by voluntarily agreeing to it.' },
        { term: 'Lotus principle', def: 'Restrictions on states’ independence cannot be presumed: states are free unless a rule binds them.' },
      ]}
      beats={[
        { caption: 'The Attorney-General’s Office of International Law: a functional definition centred on who international law is for — states, international organisations and, in some cases, individuals, groups and transnational companies.' },
        { caption: 'The Practitioner’s Guide stresses voluntariness: international law is authoritative for all states because they recognise it by voluntarily consenting to agreed standards.' },
        { caption: 'S.S. Lotus locates the binding force: rules come from states’ free will, in conventions or generally accepted usages — and restrictions on independence cannot be presumed.' },
        { caption: 'Together they give an answer two moves: identify who the rule addresses, then the convention or usage that supplies its binding force. Reach for Lotus first — it is a test, not just a description.' },
      ]}
      scene={scene}
      check={{
        question: 'A problem asks whether a claimed rule really binds a state. Which definition supplies a test?',
        options: [
          { text: 'The AG’s, because it says who the rules are for', why: 'It identifies subjects and addressees, but does not say where binding force comes from.' },
          { text: 'Lotus: consent expressed in convention or usage; restrictions are not presumed', correct: true, why: 'The card: reach for Lotus first — it supplies a test, not just a description.' },
          { text: 'None: a rule binds once most states accept it', why: 'Lotus says restrictions on a state’s independence cannot be presumed; it must have consented.' },
        ],
      }}
    />
  );
}
