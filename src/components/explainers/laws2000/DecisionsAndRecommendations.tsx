/*
SCENE: Decisions and recommendations — which parts of a Security Council resolution bind
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 one resolution, two kinds of paragraph · 2 the recommendation falls away: not binding ·
  3 the decision passes through art 25: binding on all members · 4 art 103: it prevails over a conflicting treaty
INTENT: Show that a resolution's binding force attaches only to its decisions (art 25), that the wording of each
  paragraph shows which is which, and that a binding decision outranks any conflicting treaty obligation (art 103).
SUBJECT: the decision paragraph's path down the chain; the recommendation's dashed dead end is the contrast.
BEAT 1 (0–25%): the resolution box with its two paragraphs. BEAT 2 (25–50%): dashed "not binding" box. BEAT 3
  (50–75%): the art 25 box (heavier stroke). BEAT 4 (75–100%): the art 103 box. Scrubbed, ease: none (base).
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas for phone legibility.
Source: concept laws2000-w10-decisions-and-recommendations; Week 10 slides 10, 14, 16; Week 10 live lecture
  transcript, Part A.1; UN Charter arts 25, 36(1), 39, 103.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Box({ y, h, title, lines, id, heavy, dashed }: { y: number; h: number; title: string; lines: string[]; id: string; heavy?: boolean; dashed?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth={heavy ? 3 : 1.5} strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={W / 2} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 50 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const Join = ({ y1, y2 }: { y1: number; y2: number }) => <line x1={W / 2} y1={y1} x2={W / 2} y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />;

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="A resolution's recommending paragraph is not binding; its deciding paragraph binds all members under art 25 and prevails over any conflicting treaty under art 103">
    <g data-step="1">
      <Box id="resolution" y={8} h={132} title="ONE RESOLUTION" lines={['¶ “recommends” the parties mediate', '¶ “decides” states shall impose', 'an arms embargo', '(the verb usually shows which)']} />
    </g>
    <g data-step="2">
      <Join y1={140} y2={160} />
      <Box id="recommend" dashed y={160} h={112} title="RECOMMENDATION · NOT BINDING" lines={['advice: a state may decline it', 'Chapter VI: art 36(1)', 'art 39: “make recommendations”']} />
    </g>
    <g data-step="3">
      <Join y1={272} y2={292} />
      <Box id="art-25" heavy y={292} h={132} title="DECISION · ART 25 · BINDING" lines={['all members “accept and carry out”', 'voted for it or not,', 'on the Council or not', 'art 39: “decide”']} />
    </g>
    <g data-step="4">
      <Join y1={424} y2={444} />
      <Box id="art-103" y={444} h={148} title="ART 103 · CHARTER PREVAILS" lines={['a binding decision is a', 'Charter obligation: it prevails', 'over any conflicting treaty', '→ the sanctions must be applied']} />
    </g>
  </svg>
);

export default function DecisionsAndRecommendations() {
  return (
    <Diagram
      label="Decisions and recommendations: only decisions bind (art 25), and a binding decision prevails over a conflicting treaty (art 103)"
      terms={[
        { term: 'Decision', def: 'A paragraph in which the Council decides what shall be done — binding on all members under art 25.' },
        { term: 'Recommendation', def: 'A paragraph in which the Council recommends — advice that does not bind.' },
        { term: 'Art 103', def: 'Where Charter obligations conflict with obligations under any other international agreement, the Charter obligations prevail.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'One resolution can mix recommendations and decisions. Which is which usually turns on the words of each paragraph — chiefly the verbs — and borderline wording is debated.' },
        { caption: 'A recommendation does not bind. Under Chapter VI the Council recommends procedures (art 36(1)); under art 39 it may “make recommendations”. A state may decline them.' },
        { caption: 'A decision binds: members “agree to accept and carry out the decisions of the Security Council” (art 25) — every member, however it voted and whether or not it sits on the Council.' },
        { caption: 'Art 103: Charter obligations prevail over obligations under any other international agreement. A treaty cannot be relied on to avoid a binding sanctions decision.' },
      ]}
      check={{
        question: 'State C has a treaty to supply arms to State D. The Council then “decides” under Chapter VII that no state may supply arms to State D. What must State C do?',
        options: [
          { text: 'Keep supplying arms — treaties must be performed in good faith', why: 'Tempting, but art 103 resolves the conflict: the Charter obligation to carry out the decision prevails over the treaty.' },
          { text: 'Stop supplying arms — the decision binds it and prevails over the treaty', correct: true, why: 'The embargo is a decision, binding under art 25, and art 103 makes that Charter obligation prevail over the arms treaty.' },
          { text: 'Choose either — a Council resolution is only a recommendation', why: 'The paragraph “decides”, so it is a decision, not a recommendation; only recommendations leave the state free to decline.' },
        ],
      }}
    />
  );
}
