/*
SCENE: Chapter VI — a corridor of the art 33(1) means, then the rooms of the Council's peaceful-settlement steps
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise
BEATS: 7 (the art 33(1) duty → the listed means (two rooms) → art 33(2) and art 34 → art 35 → art 36 → art 37(1))
INTENT: Walk the order of Chapter VI: the parties first choose a peaceful means; the Council can call on them,
  investigate, receive referrals and recommend — but under Chapter VI it never imposes anything.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts (base). LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w10-peaceful-settlement-under-chapter-vi; Week 10 slides 11–14; UN Charter arts 33–37.
*/
import { Palace } from '../bases/Palace';

export default function PeacefulSettlementUnderChapterVi() {
  return (
    <Palace
      label="Chapter VI: the art 33 means of peaceful settlement and the Security Council’s steps, in order"
      terms={[
        { term: 'Pacific settlement', def: 'Settling a dispute by peaceful means — the subject of Chapter VI of the Charter.' },
        { term: 'Art 33(1)', def: 'Parties to a dispute likely to endanger peace must first seek a peaceful solution of their own choice.' },
        { term: 'Recommend', def: 'What the Council does under Chapter VI: it suggests procedures; it does not impose them.' },
      ]}
      loci={[
        { title: 'Room 1 · The duty (art 33(1))', body: 'Parties to any dispute whose continuance is likely to endanger the maintenance of international peace and security shall, first of all, seek a solution by peaceful means.' },
        { title: 'Room 2 · Negotiation, enquiry, mediation, conciliation', body: 'The first means listed in art 33(1). The slides’ tools table also names good offices.' },
        { title: 'Room 3 · Arbitration, judicial settlement, regional agencies', body: 'Arbitration (the PCA), judicial settlement (the ICJ), resort to regional agencies or arrangements — “or other peaceful means of their own choice”: the list is open-ended.' },
        { title: 'Room 4 · The Council calls on the parties and investigates', body: 'When it deems necessary it calls on the parties to settle by art 33 means (art 33(2)), and it can investigate any dispute or situation that might lead to international friction (art 34).' },
        { title: 'Room 5 · Any member may raise it (art 35)', body: 'Any UN member may bring a dispute, or a situation of the art 34 kind, to the attention of the Council — or of the General Assembly.' },
        { title: 'Room 6 · The Council recommends (art 36)', body: 'It can recommend appropriate procedures or methods of adjustment (art 36(1)), and should consider that legal disputes should as a general rule be referred by the parties to the ICJ (art 36(3)).' },
        { title: 'Room 7 · Unsettled? Refer it to the Council (art 37(1))', body: 'Parties who fail to settle by the art 33 means shall refer the dispute to the Council. Coercion only begins under Chapter VII, after an art 39 determination.' },
      ]}
      check={{
        question: 'Under Chapter VI, can the Security Council impose binding sanctions on the parties to a dispute?',
        options: [
          { text: 'Yes — art 36(1) lets it impose any method of adjustment', why: 'Art 36(1) lets the Council recommend procedures or methods of adjustment; it does not impose them.' },
          { text: 'No — it investigates, calls on the parties and recommends; sanctions are Chapter VII (art 41)', correct: true, why: 'Chapter VI powers are recommendatory (arts 33(2), 34, 36); coercive measures need an art 39 determination under Chapter VII.' },
          { text: 'Yes — once the parties refer the dispute under art 37(1)', why: 'A referral under art 37(1) brings the dispute to the Council, but sanctions still require Chapter VII.' },
        ],
      }}
    />
  );
}
