/*
SCENE: Defining tort law — "law of tort" or "law of torts"?
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Hold the two answers to the old debate side by side, then show where both meet today: judge-made common
  law and statute co-existing.
SUBJECT: the split — one path to unifying principle, one to a list of causes of action — and where they rejoin.
STEPS: 1 tort (tortum; civil wrongs) · 2 left path: law of tort (Pollock, Winfield) · 3 right path: law of torts
  (Salmond) · 4 both paths meet at the common law / statute overlap (CLA 2002 (NSW)).
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so type stays legible on phones.
Source: concept laws2400-w01-defining-tort-law (no cases or authorities linked).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const txt = (size: number) => ({ fontFamily: 'var(--font-body)', fontSize: size, fill: 'var(--ink-2)' }) as const;

function Box({ x, y, w, h, title, lines, id, size = 15 }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; id: string; size?: number }) {
  const cx = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={cx} y={y + 26} textAnchor="middle" {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x={cx} y={y + 50 + i * (size + 5)} textAnchor="middle" {...txt(size)}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 580`} role="img" aria-label="Tort splits into two paths, law of tort and law of torts, which meet again at the common law and statute overlap">
    <g data-step="1">
      <Box id="tort" x={8} y={10} w={W - 16} h={110} title="TORT" lines={['Latin tortum: twisted, wrong, crooked', 'civil wrongs: avoid causing harm,', 'and if harm is caused, remedy it']} />
    </g>
    <g data-step="2">
      <path d="M130 120 C 130 150, 92 150, 92 180" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="law-of-tort" x={8} y={180} w={168} h={150} size={13} title="LAW OF TORT" lines={['one set of unifying', 'principles: duties owed', 'by everyone to everyone', '', 'Pollock · Winfield']} />
    </g>
    <g data-step="3">
      <path d="M230 120 C 230 150, 268 150, 268 180" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="law-of-torts" x={184} y={180} w={168} h={150} size={13} title="LAW OF TORTS" lines={['a collection of', 'miscellaneous, separate', 'causes of action', '', 'Salmond']} />
    </g>
    <g data-step="4">
      <path d="M92 330 C 92 370, 180 360, 180 390" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d="M268 330 C 268 370, 180 360, 180 390" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="overlap" x={8} y={390} w={W - 16} h={180} title="COMMON LAW + STATUTE" lines={['mostly judge-made: cases are critical', 'statutes such as the Civil Liability', 'Act 2002 (NSW) modify or abolish parts', 'and create new causes of action —', 'not codified: the two co-exist']} />
    </g>
  </svg>
);

export default function DefiningTortLaw() {
  return (
    <Diagram
      label="Defining tort law: law of tort or law of torts, meeting at the common law and statute overlap"
      terms={[
        { term: 'Tort', def: 'From the Latin tortum, "something twisted, wrong or crooked": a civil wrong.' },
        { term: 'Law of tort', def: 'The view that tort rests on one set of unifying principles.' },
        { term: 'Law of torts', def: 'The view that tort is a list of separate causes of action.' },
        { term: 'Cause of action', def: 'A recognised basis on which a plaintiff can sue.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Tort law is the body of rules for civil wrongs: avoid causing harm to others, and if harm is caused, remedy it — usually by compensation.' },
        { caption: 'One path: the "law of tort". Pollock and Winfield argued it rests on fundamental principles, such as duties owed by everyone to everyone else.' },
        { caption: 'The other path: the "law of torts". Salmond argued tort law is merely a collection of miscellaneous causes of action.' },
        { caption: 'Both paths meet in practice: tort is mostly judge-made, but statutes like the CLA modify or abolish parts of it and create new causes of action. Always check the statute first.' },
      ]}
      check={{
        question: 'How do statutes such as the Civil Liability Act 2002 (NSW) relate to the common law of tort?',
        options: [
          { text: 'They have codified tort law, replacing the cases', why: 'Statutes have not replaced or codified the common law outright; cases remain critical.' },
          { text: 'They modify or abolish parts of it and create new causes of action, so cases and statutes co-exist', correct: true, why: 'That is the relationship the notes describe — so check whether a statute has modified the rule before applying it.' },
          { text: 'They apply only where no case law exists', why: 'Statutes can change existing common law rules, not only fill gaps — so a statute can displace a settled case rule.' },
        ],
      }}
    />
  );
}
