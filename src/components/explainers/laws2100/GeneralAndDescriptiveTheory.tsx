/*
SCENE: What legal philosophy is for — a spectrum from descriptive to value-laden
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Place Hart (general and descriptive), Dickson (elucidating law's important features) and Finnis (premises
  about true human goods) on one axis, and set Dickson's sceptics off the axis: does law have a nature at all?
SUBJECT: the vertical spectrum; one marker draws on per step.
STEPS: 1 axis + Hart at the descriptive end (two criteria) · 2 Finnis at the other end · 3 Dickson between ·
  4 sceptics, dashed and off the axis.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz. Vertical axis on a 360-unit canvas so labels never crowd at phone width.
Source: concept laws2100-w01-general-and-descriptive-theory; authorities hart-the-concept-of-law,
  finnis-philosophy-of-law, dickson-elucidating-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Stop({ y, name, lines, id }: { y: number; name: string; lines: string[]; id: string }) {
  return (
    <>
      <circle cx="30" cy={y} r="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="54" y={y + 4} {...head} data-label={id}>{name}</text>
      {lines.map((l, i) => <text key={i} x="54" y={y + 26 + i * 19} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="A vertical spectrum: Hart's general and descriptive theory at the top, Dickson in the middle, Finnis at the bottom, sceptics off to one side">
    <g data-step="1">
      <line x1="30" y1="40" x2="30" y2="400" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="54" y="14" {...body} fontSize={12}>morally neutral, no justificatory aims</text>
      <Stop id="hart" y={50} name="HART · GENERAL AND DESCRIPTIVE" lines={['general: not tied to one legal system', 'or culture', 'descriptive: morally neutral']} />
    </g>
    <g data-step="2">
      <Stop id="finnis" y={330} name="FINNIS · NATURAL LAW" lines={['reasonableness of law cannot be', 'assessed without premises about', 'true human goods']} />
      <text x="54" y="432" {...body} fontSize={12}>analysis tied to what we ought to do</text>
    </g>
    <g data-step="3">
      <Stop id="dickson" y={190} name="DICKSON · ELUCIDATING LAW" lines={["identify law's most important and", 'significant features — an active,', 'never-ending process']} />
    </g>
    <g data-step="4">
      <rect x="8" y="460" width={W - 16} height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="24" y="484" {...head}>{"OFF THE AXIS · DICKSON'S SCEPTICS"}</text>
      <text x="24" y="508" {...body}>can a human-made social construction</text>
      <text x="24" y="527" {...body}>have a nature? is conceptual analysis</text>
      <text x="24" y="546" {...body}>a sound method?</text>
    </g>
  </svg>
);

export default function GeneralAndDescriptiveTheory() {
  return (
    <Diagram
      label="What legal philosophy is for: Hart, Dickson and Finnis on one spectrum, with the sceptics off it"
      terms={[
        { term: 'General', def: 'Not tied to any particular legal system or legal culture.' },
        { term: 'Descriptive', def: 'Morally neutral, with no justificatory aims.' },
        { term: 'Metatheoretical', def: "Assessing a theory against criteria — here, Hart's own two." },
      ]}
      figure={figure}
      steps={[
        { caption: 'Hart: "a theory of what law is which is both general and descriptive" (CL 239). The two claims are criteria to assess the theory on its own terms.' },
        { caption: 'Finnis: making and complying with law involves rational judgment whose reasonableness cannot be assessed without premises about true human goods — analysis tied to what we ought to do.' },
        { caption: "Dickson: legal philosophy elucidates law, identifying its most important features — which can help us decide whether to take law as having authority over us." },
        { caption: 'Some doubt that a human-made social construction can have a nature; others doubt conceptual analysis as a method. Test "general" and "descriptive" separately.' },
      ]}
      check={{
        question: 'A critic shows that Hart\'s concepts fit modern state systems but not customary systems. Which criterion is under pressure?',
        options: [
          { text: 'Descriptive', why: 'Nothing here says the theory is morally loaded; the complaint is about reach, not neutrality.' },
          { text: 'General', correct: true, why: 'Generality means not tied to any particular system or culture — a failure of fit elsewhere tests exactly that.' },
          { text: 'Both, necessarily', why: 'A theory can pass one criterion and fail the other; test them separately.' },
        ],
      }}
    />
  );
}
