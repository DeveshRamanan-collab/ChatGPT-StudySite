/*
SCENE: The post-WWII military tribunals — three lanes (Nuremberg, Tokyo, the domestic track), with the three crime
  categories running across the first two
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 5 (Nuremberg's instrument → art 6 crimes → Tokyo → Control Council Law No 10 and Allied trials → instruments)
INTENT: Each post-war mechanism rests on a different instrument — an agreement, a proclamation, occupation law — and
  Nuremberg's three crimes carried across to Tokyo.
SUBJECT: the three crime boxes, whose dashed lines drop into the Tokyo lane.
BEAT 1 (0–20%): Nuremberg lane — London Agreement with the IMT Charter annexed; who was responsible.
BEAT 2 (20–40%): art 6 — (A) crimes against peace, (B) war crimes, (C) crimes against humanity.
BEAT 3 (40–60%): Tokyo lane — MacArthur's proclamation; art 5(a)–(c); 28 · 55 · 7.
BEAT 4 (60–80%): domestic track — Control Council Law No 10; twelve US trials; thousands of Allied trials.
BEAT 5 (80–100%): the instrument behind each. Ease: none (scrubbed); text fades.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w11-post-wwii-military-tribunals; imt-charter-art-6, imtfe-charter-art-5 (Week 11 Lecture
  Slides, slides 10–14).
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;
const faint = { fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1.5 } as const;

const crime = (x: number, a: string, b: string, id: string) => (
  <g key={id}>
    <rect x={x} y="94" width="108" height="52" rx="10" {...ink} />
    <text x={x + 54} y="116" textAnchor="middle" {...note} fill="var(--ink)" data-label={id}>{a}</text>
    <text x={x + 54} y="134" textAnchor="middle" {...note} fill="var(--ink)">{b}</text>
  </g>
);

const figure = (
  <svg viewBox="0 0 360 528" role="img" aria-label="Nuremberg, Tokyo and the domestic track, each resting on a different instrument">
    <g data-step="1">
      <text x="16" y="22" {...ui} data-label="imt">NUREMBERG · IMT</text>
      <line x1="16" y1="30" x2="344" y2="30" {...faint} />
      <text x="16" y="50" {...note}>London Agreement + IMT Charter annexed</text>
      <text x="16" y="68" {...note}>leaders, organisers, instigators, accomplices</text>
    </g>
    <g data-step="2">
      {crime(10, '(A) crimes', 'against peace', 'peace')}
      {crime(126, '(B) war', 'crimes', 'war')}
      {crime(242, '(C) crimes', 'against humanity', 'humanity')}
      <path d="M64 146 V192 M180 146 V192 M296 146 V192" {...faint} strokeDasharray="4 5" />
    </g>
    <g data-step="3">
      <text x="16" y="186" {...ui} data-label="imtfe">TOKYO · IMTFE</text>
      <line x1="16" y1="194" x2="344" y2="194" {...faint} />
      <text x="16" y="216" {...note}>MacArthur’s proclamation (Potsdam Declaration)</text>
      <text x="16" y="234" {...note}>art 5(a)–(c): peace · conventional war crimes ·</text>
      <text x="16" y="252" {...note}>humanity — the same three categories</text>
      <rect x="10" y="266" width="340" height="44" rx="10" {...ink} />
      <text x="180" y="293" textAnchor="middle" {...note} fill="var(--ink)">28 defendants · 55 counts · 7 death sentences</text>
    </g>
    <g data-step="4">
      <text x="16" y="340" {...ui} data-label="ccl10">DOMESTIC · CONTROL COUNCIL LAW No 10</text>
      <line x1="16" y1="348" x2="344" y2="348" {...faint} />
      <text x="16" y="370" {...note}>prosecutions in the Allied zones of occupation —</text>
      <text x="16" y="388" {...note}>twelve US trials (Nuremberg Military Tribunals)</text>
      <text x="16" y="410" {...note}>+ thousands of Allied trials in the Asia-Pacific:</text>
      <text x="16" y="428" {...note}>China, US, Netherlands, UK, Australia,</text>
      <text x="16" y="446" {...note}>the Philippines, France</text>
    </g>
    <g data-step="5">
      <rect x="10" y="464" width="340" height="52" rx="12" {...faint} />
      <text x="180" y="487" textAnchor="middle" {...note} fill="var(--ink)">agreement · proclamation · occupation law</text>
      <text x="180" y="505" textAnchor="middle" {...note}>Nuremberg · Tokyo · zones of occupation</text>
    </g>
  </svg>
);

export default function PostWwiiMilitaryTribunals() {
  return (
    <Diagram
      label="The post-WWII military tribunals and the instruments behind them"
      terms={[
        { term: 'London Agreement', def: 'The Allied agreement, with the IMT Charter annexed, that created the Nuremberg tribunal.' },
        { term: 'Art 6, IMT Charter', def: 'Crimes against peace, war crimes and crimes against humanity, each with individual responsibility.' },
        { term: 'IMTFE', def: 'The International Military Tribunal for the Far East, in Tokyo.' },
        { term: 'Control Council Law No 10', def: 'The basis for domestic prosecutions in the Allied zones of occupation.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The Allies shared an intention to punish Axis war criminals but were divided over purpose and procedure. The London Agreement, with the IMT Charter annexed, created the Nuremberg tribunal, providing for the individual criminal responsibility of leaders, organisers, instigators and accomplices.' },
        { caption: 'Art 6 listed three crimes “for which there shall be individual responsibility”: crimes against peace (planning or waging a war of aggression, or conspiring to); war crimes (violations of the laws or customs of war); and crimes against humanity (inhumane acts against any civilian population, or persecutions, whether or not in violation of the domestic law where perpetrated).' },
        { caption: 'In Tokyo the IMTFE was established by proclamation of US General Douglas MacArthur, implementing the Potsdam Declaration. 28 defendants were charged with 55 counts under art 5(a)–(c) — crimes against peace, conventional war crimes and crimes against humanity. All were found guilty, though not on every count; seven were sentenced to death. It largely agreed with Nuremberg on the law.' },
        { caption: 'Control Council Law No 10 allowed domestic prosecutions in the Allied zones of occupation — best known, twelve US trials by the Nuremberg Military Tribunals — and the Allies, Australia among them, held thousands of trials in the Asia-Pacific region and beyond.' },
        { caption: 'Exam use: name the instrument behind each mechanism — an agreement (Nuremberg), a proclamation (Tokyo), occupation law (Control Council Law No 10).' },
      ]}
      check={{
        question: 'Which instrument established the Tokyo tribunal (IMTFE)?',
        options: [
          { text: 'The London Agreement, with a charter annexed', why: 'That created the Nuremberg IMT, not the Tokyo tribunal.' },
          { text: 'A proclamation by General MacArthur implementing the Potsdam Declaration', correct: true, why: 'The slides say the IMTFE was established by MacArthur’s proclamation, in implementation of the Potsdam Declaration.' },
          { text: 'Control Council Law No 10', why: 'That law enabled domestic prosecutions in the Allied zones of occupation, not the Tokyo tribunal.' },
        ],
      }}
    />
  );
}
