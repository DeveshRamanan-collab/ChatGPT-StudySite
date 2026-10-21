/*
SCENE: BCG's six innovation models — a corridor of seven frames
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks the corridor), paced Next/Back otherwise (Palace base)
BEATS: 7 (one per locus)
INTENT: Fix the six models in BCG's order — each with its motto, defining move and example — and end on the
  reading's real point: the right model depends on industry and company context.
SUBJECT: the amber light standing at the current frame.
BEAT 1–6: creator (Apple) · solution builder (Nike) · leverager (Zara) · expander (Amazon, Gilead) · defender
  (Allstate–Esurance) · fast follower (Reckitt Benckiser).
BEAT 7: context decides — Sears (defender in a disrupted industry); Amazon and Costco (two models, one industry);
  back the model with a blueprint.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15° toward the frame, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL), check beneath.
BUDGET: own chunk < 4 KB gz (three and the Palace base are shared), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w11-bcg-six-innovation-models; reading mgmt2094-reading-bcg-2017-innovation-models
  (Manly, Grassl and Wilson 2017, exhibit p 2 and pp 1–4); examples nike, zara, amazon-and-costco, allstate-esurance,
  reckitt-benckiser, sears-defender.
*/
import { Palace } from '../bases/Palace';

export default function BcgSixInnovationModels() {
  return (
    <Palace
      label="A corridor of seven frames: BCG's six innovation models, then context"
      terms={[
        { term: 'Innovation model', def: "BCG's term for a company's consistent way of innovating, with its own design principles and capabilities." },
        { term: 'Adjacent market', def: 'A market next to the core one, which an expander enters with a core capability.' },
        { term: 'Context', def: "The industry's dynamics and the company's own strategy, position and capabilities, which decide which model fits." },
        { term: 'Blueprint', def: 'Structure and culture, tools and processes, metrics and incentives, aligned with the chosen model.' },
      ]}
      loci={[
        { title: 'Creator — "We know best"', body: 'Typically led by a visionary; disrupts its core markets, protects its intellectual property and makes a limited number of focused big bets. Apple is the classic example.' },
        { title: 'Solution builder — "We\'re listening"', body: 'Wins by understanding and delighting customers, drawing on deep customer insight and the full purchase experience. Nike links shoe sensors to personalised feedback.' },
        { title: 'Leverager — "We do it best"', body: "Innovates its core business model to drive ongoing advantage, improving it continuously. Zara's design, manufacturing and distribution processes speed new items to stores." },
        { title: 'Expander — "Seeking share to steal"', body: 'Uses a core capability to enter and dominate adjacent markets, with a mandate for growth. Amazon carries data analytics, logistics and service into new retail sectors.' },
        { title: 'Defender — "Protecting our turf"', body: 'Focuses on points of advantage in mature or slow-changing sectors, monitoring for disruption and using M&A to keep pace. Allstate acquired Esurance.' },
        { title: 'Fast follower — "Ready to react"', body: 'Optimises its capabilities to react rapidly to, and improve on, competitive innovations. Reckitt Benckiser invests downstream in testing and keeps a flat structure.' },
        { title: 'Context decides', body: "Only some models succeed in each industry: Sears defended its brand and stores as online players upended retail, and lost its edge. Amazon (expander) and Costco (leverager) both win in retail because each model fits the company. Back the choice with a blueprint." },
      ]}
      check={{
        question: 'Allstate spotted the shift to online and app-based insurance and acquired the pioneer Esurance. Which model is that?',
        options: [
          { text: 'Expander', why: 'Tempting because an acquisition looks like expansion, but BCG presents it as Allstate defending itself against a disruption so it would not fall behind.' },
          { text: 'Defender', correct: true, why: 'Defenders monitor the landscape for disruptive innovations and defend against them with tactics such as partnerships and acquisitions.' },
          { text: 'Fast follower', why: 'Tempting because Allstate responded to a rival, but it bought the pioneer rather than quickly copying and improving its product.' },
        ],
      }}
    />
  );
}
