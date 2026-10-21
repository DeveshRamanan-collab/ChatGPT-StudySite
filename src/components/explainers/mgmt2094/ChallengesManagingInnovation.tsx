/*
SCENE: Seven challenges in managing innovation — a corridor walk
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise
BEATS: 7 (one per locus)
INTENT: Fix the seven challenges in the slides' order, each with its one-line gloss, and show routines as the thread
  between challenge 4 (create them) and challenge 5 (keep developing them).
SUBJECT: the amber light standing at the current locus.
BEAT 1: Why change? — only innovation matters.
BEAT 2: What to change? — from product and service to the ways (process innovation).
BEAT 3: Understanding innovation — problems of partial views.
BEAT 4: Building an innovation culture — firm-specific routines (repeated, reinforced patterns of behaviour).
BEAT 5: Continuous learning — keep developing routines for environmental challenges.
BEAT 6: High involvement innovation — more participation is a competitive advantage.
BEAT 7: Managing connections — in relationship with others, not splendid isolation.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w12-challenges-managing-innovation (Week 12 slides 9–10); examples
  mgmt2094-example-gilbert-tobin-legalvision, mgmt2094-example-guest-shelley-simpson.
*/
import { Palace } from '../bases/Palace';

export default function ChallengesManagingInnovation() {
  return (
    <Palace
      label="A corridor with seven frames: the challenges faced while managing innovation"
      terms={[
        { term: 'Routine', def: 'A repeated, reinforced pattern of behaviour that defines a firm\'s particular approach to the problem.' },
        { term: 'Process innovation', def: 'Changing the ways things are done, at the far end of "what to change?" from product and service.' },
        { term: 'High involvement innovation', def: 'A higher level of participation in innovation, which represents a competitive advantage.' },
        { term: 'Splendid isolation', def: 'Working alone; managing connections asks firms to operate in relationship with others instead.' },
      ]}
      loci={[
        { title: '1 · Why change?', body: 'Only innovation matters.' },
        { title: '2 · What to change?', body: 'Ranging from changes in product and service to the ways things are done, i.e. process innovation.' },
        { title: '3 · Understanding innovation', body: 'Understanding the common problems associated with partial views of innovation.' },
        { title: '4 · Building an innovation culture', body: 'Managing innovation is all about creating firm-specific routines: repeated, reinforced patterns of behaviour that define the firm\'s particular approach.' },
        { title: '5 · Continuous learning', body: 'Firms constantly need to develop their routines to deal with environmental challenges. Shelley Simpson had to learn logistics, freight and compliance as her business grew.' },
        { title: '6 · High involvement innovation', body: 'A higher level of participation in innovation represents a competitive advantage.' },
        { title: '7 · Managing connections', body: 'Organisations must operate in relationship with others rather than in splendid isolation, as Gilbert + Tobin did by partnering with LegalVision.' },
      ]}
      check={{
        question: 'A firm keeps developing its routines as its environment changes. Which challenge is that?',
        options: [
          { text: 'Building an innovation culture', why: 'Challenge 4 creates the firm-specific routines; constantly developing them for environmental challenges is challenge 5.' },
          { text: 'Continuous learning', correct: true, why: 'Challenge 5 says firms constantly need to develop their routines to deal with environmental challenges.' },
          { text: 'Managing connections', why: 'Challenge 7 is about operating in relationship with others, not about developing routines.' },
        ],
      }}
    />
  );
}
