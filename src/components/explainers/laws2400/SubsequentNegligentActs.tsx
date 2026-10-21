/*
SCENE: Negligent acts followed by negligent acts (Topic 11 flowchart, Tort Law Principles 3e p 437)
LENGTH: 4 steps, scroll-drawn when pinned (4 × 80vh); Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show that later negligence — a third party's or even the plaintiff's — is weighed as a matter of fact and
  degree and does not necessarily sever the chain, especially where the defendant generated the very risk it realised.
SUBJECT: the chain from the defendant's negligence to the injury; the later negligent actor joins from the side and
  the chain is redrawn thick once the very-risk bracket closes around it.
BEAT 1 (0–25%): the defendant's negligence → injury, and a second careless actor (third party or plaintiff) joining.
  Caption: fact and degree (Mahony).
BEAT 2 (25–50%): the chain stays drawn — "not necessarily severed" (Mahony; Burns v Pearce).
BEAT 3 (50–75%): a bracket from the defendant's negligence around the later act: "the very risk D generated", "in the
  ordinary course of things" (March v Stramare; eg Club Italia, Jausnik (No 5), Gittani Stone).
BEAT 4 (75–100%): a dashed side box: a deliberate, volitional act goes to the voluntary-act test instead.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: finished diagram with all four captions stacked; calm = quicker steps.
BUDGET: < 10 KB gz.
Source: concept laws2400-w11-subsequent-negligent-acts; flowchart p 437. The flowchart writes "March v E & MH Stramare
  Pty Ltd"; the shared case card (from week 10) is march-v-stramare. No case facts: the materials give none.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function T({ x, y, children, size = 13, fill = 'var(--ink-2)', anchor = 'middle', italic = false }: {
  x: number; y: number; children: string; size?: number; fill?: string; anchor?: 'middle' | 'start'; italic?: boolean;
}) {
  return <text x={x} y={y} textAnchor={anchor} {...ui} fontSize={size} fill={fill} fontStyle={italic ? 'italic' : undefined}>{children}</text>;
}

const figure = (
  <svg viewBox={`0 0 ${W} 620`} role="img" aria-label="The defendant's negligence leads to the plaintiff's injury; a later negligent act joins the chain; the chain is not necessarily severed, especially where the defendant generated the very risk; a deliberate act goes to a different test">
    <g data-step="1">
      <rect x="8" y="8" width="200" height="56" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <T x={108} y={32} fill="var(--ink)" size={14}>Defendant’s negligence</T>
      <T x={108} y={52} size={12}>the first careless act</T>
      <line x1="60" y1="64" x2="60" y2="330" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="214" y="150" width="128" height="76" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <T x={278} y={172} fill="var(--ink)" size={13}>Later negligence</T>
      <T x={278} y={192} size={12}>by a third party,</T>
      <T x={278} y={210} size={12}>or the plaintiff</T>
      <line x1="214" y1="188" x2="68" y2="188" stroke="var(--ink-2)" strokeWidth="1.5" />
      <polyline points="74,183 68,188 74,193" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <T x={140} y={180} size={12}>fact and degree</T>
      <T x={140} y={206} size={11.5} italic>Mahony</T>
      <rect x="8" y="330" width="200" height="50" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <T x={108} y={360} fill="var(--ink)" size={14}>Plaintiff’s injury</T>
    </g>
    <g data-step="2">
      <rect x="72" y="236" width="136" height="86" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <T x={140} y={258} fill="var(--ink)" size={12.5}>not necessarily</T>
      <T x={140} y={276} fill="var(--ink)" size={12.5}>severed</T>
      <T x={140} y={298} size={11.5} italic>Mahony;</T>
      <T x={140} y={314} size={11.5} italic>Burns v Pearce</T>
    </g>
    <g data-step="3">
      <path d="M 212 36 H 354 V 355 H 212" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="60" y1="64" x2="60" y2="330" stroke="var(--ink)" strokeWidth="4" />
      <T x={278} y={252} fill="var(--ink)" size={12.5}>the very risk the</T>
      <T x={278} y={270} fill="var(--ink)" size={12.5}>defendant generated,</T>
      <T x={278} y={290} size={12}>in the ordinary</T>
      <T x={278} y={308} size={12}>course of things</T>
      <T x={W / 2} y={406} size={12} italic>March v E &amp; MH Stramare Pty Ltd</T>
      <T x={W / 2} y={424} size={11.5}>eg Club Italia v Ritchie; Jausnik (No 5);</T>
      <T x={W / 2} y={440} size={11.5}>Gittani Stone v Pavkovic</T>
    </g>
    <g data-step="4">
      <rect x="8" y="476" width={W - 16} height="120" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <T x={W / 2} y={502} fill="var(--ink)" size={13}>Not careless but deliberate?</T>
      <T x={W / 2} y={526} size={12}>A volitional act, or an extremely unlikely</T>
      <T x={W / 2} y={544} size={12}>coincidence, goes to the voluntary-act test:</T>
      <T x={W / 2} y={562} size={12}>it ordinarily severs the chain</T>
      <T x={W / 2} y={582} size={11.5} italic>The Oropesa; Haber v Walker</T>
    </g>
  </svg>
);

export default function SubsequentNegligentActs() {
  return (
    <Diagram
      label="Negligent acts followed by negligent acts"
      terms={[
        { term: 'Fact and degree', def: 'An evaluative question about these facts, not a fixed rule either way (Mahony).' },
        { term: 'Very risk', def: 'The risk of injury the defendant’s own wrongful conduct created.' },
        { term: 'Ordinary course of things', def: 'The injury came about in the way such risks usually play out.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The defendant’s negligence is followed by someone else’s — a third party’s, or the plaintiff’s. Whether that severs the chain is a matter of fact and degree (Mahony v J Kruschich (Demolitions) Pty Ltd).' },
        { caption: 'Later negligence, even the plaintiff’s own, does not necessarily sever the chain of causation (Mahony; Burns v Pearce).' },
        { caption: 'Especially where the defendant’s wrongful conduct generated the very risk of injury the later negligence brought about, and the injury occurred in the ordinary course of things (March v E & MH Stramare Pty Ltd).' },
        { caption: 'Contrast a deliberate, volitional intervention, or an extremely unlikely coincidence: that goes to the voluntary-act test, where it ordinarily severs the chain.' },
      ]}
      check={{
        question: 'A defendant’s negligence is followed by the plaintiff’s own carelessness. What does the flowchart say?',
        options: [
          { text: 'The plaintiff’s carelessness always severs the chain', why: 'The flowchart says even the plaintiff’s own negligence does not necessarily sever the chain.' },
          { text: 'It does not necessarily sever the chain: fact and degree', correct: true, why: 'Mahony and Burns v Pearce: later negligence, even the plaintiff’s, does not necessarily sever the chain; it is a matter of fact and degree.' },
          { text: 'It is irrelevant once the defendant was negligent', why: 'Later events can take an injury outside the scope of liability; for later negligence the question is one of fact and degree.' },
        ],
      }}
    />
  );
}
