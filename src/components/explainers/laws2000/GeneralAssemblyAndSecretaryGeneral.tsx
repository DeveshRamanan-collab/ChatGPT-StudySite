/*
SCENE: The General Assembly and the Secretary-General — the organs beside the Security Council
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 the Assembly (193 states, one vote) · 2 its subsidiary role: discuss and recommend (arts 11(2), 14) ·
  3 the art 12(1) bar · 4 Uniting for Peace · 5 the Secretary-General (art 99, good offices)
INTENT: Show that the Assembly recommends and the Council decides: the Assembly's subsidiary role stops while the
  Council is seised (art 12(1)) unless a P-5 deadlock triggers Uniting for Peace; the Secretary-General alerts and mediates.
SUBJECT: the stack of boxes beneath the Assembly; the art 12(1) bar is the hinge.
BEAT 1 (0–20%): the Assembly box. BEAT 2 (20–40%): recommend box. BEAT 3 (40–60%): the art 12(1) bar (heavier
  stroke). BEAT 4 (60–80%): Uniting for Peace. BEAT 5 (80–100%): the Secretary-General. Scrubbed, ease: none (base).
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 8 KB gz, no WebGL. Narrow 360-unit canvas for phone legibility.
Source: concept laws2000-w10-general-assembly-and-secretary-general; Week 10 slides 38–43; UN Charter arts 11(2),
  12(1), 14, 18, 99; GA Res 377(V); Certain Expenses (Advisory Opinion); Wall Advisory Opinion paras 27–28.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Box({ y, h, title, lines, id, heavy }: { y: number; h: number; title: string; lines: string[]; id: string; heavy?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth={heavy ? 3 : 1.5} />
      <text x={W / 2} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 50 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const Join = ({ y1, y2 }: { y1: number; y2: number }) => <line x1={W / 2} y1={y1} x2={W / 2} y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />;

const figure = (
  <svg viewBox={`0 0 ${W} 700`} role="img" aria-label="The General Assembly recommends on peace and security, must stand back while the Council deals with a matter unless Uniting for Peace applies; the Secretary-General can alert the Council and offer good offices">
    <g data-step="1">
      <Box id="assembly" y={8} h={112} title="GENERAL ASSEMBLY" lines={['193 states · one state, one vote (art 18)', 'the most “democratic” organ', 'minimal role in enforcement']} />
    </g>
    <g data-step="2">
      <Join y1={120} y2={140} />
      <Box id="recommend" y={140} h={112} title="SUBSIDIARY ROLE · RECOMMEND" lines={['discuss any peace question (art 11(2))', 'peaceful adjustment (art 14)', 'action needed? refer to the Council']} />
    </g>
    <g data-step="3">
      <Join y1={252} y2={272} />
      <Box id="art-12" heavy y={272} h={112} title="ART 12(1) · STAND BACK" lines={['while the Council deals with it,', 'no recommendation unless asked', '(Wall, paras 27–28)']} />
    </g>
    <g data-step="4">
      <Join y1={384} y2={404} />
      <Box id="uniting" y={404} h={132} title="UNITING FOR PEACE · RES 377(V)" lines={['Council deadlocked: no P-5 unanimity', '→ the Assembly considers it at once', 'and recommends collective measures', '(confirmed: Certain Expenses)']} />
    </g>
    <g data-step="5">
      <Box id="sg" y={566} h={126} title="SECRETARY-GENERAL" lines={['heads the Secretariat · five-year term', 'art 99: alert the Council to threats', 'good offices · Special Representatives']} />
    </g>
  </svg>
);

export default function GeneralAssemblyAndSecretaryGeneral() {
  return (
    <Diagram
      label="The General Assembly’s subsidiary role, the art 12(1) bar, Uniting for Peace, and the Secretary-General"
      terms={[
        { term: 'Subsidiary responsibility', def: 'The Assembly’s secondary role in peace and security, beside the Council’s primary responsibility.' },
        { term: 'Art 12(1)', def: 'While the Council deals with a dispute or situation, the Assembly makes no recommendation on it unless asked.' },
        { term: 'Uniting for Peace', def: 'GA Res 377(V) (1950): when the P-5 deadlock the Council, the Assembly may recommend collective measures.' },
        { term: 'Good offices', def: 'The Secretary-General’s mediation in international crises and conflicts.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The General Assembly is the UN’s parliamentary body: all 193 member states, one state, one vote (art 18). The most “democratic” organ, but with a minimal role in enforcement.' },
        { caption: 'It has a subsidiary responsibility: it may discuss any question of peace and security and recommend (art 11(2)), and recommend measures for peaceful adjustment (art 14; Certain Expenses) — but questions needing action go to the Council.' },
        { caption: 'Art 12(1): while the Council is exercising its functions on a dispute or situation, the Assembly shall not make any recommendation on it unless the Council so requests (Wall Advisory Opinion, paras 27–28).' },
        { caption: 'Uniting for Peace (Res 377(V), 1950): if lack of unanimity of the permanent members stops the Council acting, the Assembly considers the matter immediately to recommend collective measures. The Cold War widened its role; the ICJ confirmed the procedure in Certain Expenses.' },
        { caption: 'The Secretary-General heads the Secretariat, an international civil service, appointed by the Assembly for five years; may bring any threat to the Council’s attention (art 99); and mediates through good offices, including Special Representatives.' },
      ]}
      check={{
        question: 'The Council is actively dealing with a border dispute. Can the General Assembly recommend a settlement?',
        options: [
          { text: 'Yes — art 14 lets it recommend on any situation', why: 'Art 14 is expressly “subject to the provisions of Article 12”.' },
          { text: 'Only if the Council requests it (art 12(1))', correct: true, why: 'While the Council is exercising its functions on the dispute, the Assembly shall not recommend unless the Council so requests.' },
          { text: 'Yes — but only by a unanimous vote of the P-5', why: 'The P-5 veto belongs to the Council; in the Assembly each state has one vote, and art 12(1) bars the recommendation anyway.' },
        ],
      }}
    />
  );
}
