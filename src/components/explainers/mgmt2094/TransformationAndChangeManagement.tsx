/*
SCENE: Transformation, focus on strengths and change management — Dow Corning 1984 to 2001
LENGTH: not pinned — a Timeline (learner-paced: drag, click a mark, or arrow keys)
BEATS: 7 events
INTENT: Show the sequence of decisions that led Dow Corning to Design for Six Sigma, and that the 1997 redesign failed
  on change management (poor take-up), not on design.
SUBJECT: the handle moving along the track; the detail panel names the decision and its reason.
BEAT 1–7: 1984 lawsuits → 1992 R&D centralised → 1994 LEOP → 1995 SAP and transformation → 1997 consultants →
  1999 abandoned for Lean Six Sigma → 2001 DFSS, piloted on the Deck Protector. Glide: base handles (power2.out).
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: the base drops the glide; the same controls and detail panel.
BUDGET: < 5 KB gz, no WebGL. Dates only where the slides give them.
Source: Week 9 slides 5–10 and 13; concept mgmt2094-w09-transformation-and-change-management.
*/
import { Timeline } from '../bases/Timeline';

export default function TransformationAndChangeManagement() {
  return (
    <Timeline
      label="Dow Corning's path to Design for Six Sigma, 1984 to 2001"
      terms={[
        { term: 'Transformation program', def: "Dow Corning's plan to become a 'world class', customer-focused, process-oriented organisation." },
        { term: 'Focus on strengths', def: 'Stop doing what you are not good at (building software) and concentrate on what you are (silicone).' },
        { term: 'Change management', def: 'Getting people to take up a new way of working; without it, a new process is not adopted.' },
        { term: 'Lean Six Sigma', def: 'The company-wide quality program Dow Corning turned to in 1999.' },
      ]}
      events={[
        { when: '1984', title: 'Breast implant lawsuits begin', tag: 'Crisis', body: 'Lawsuits over silicone breast implants begin, culminating in a 1998 multibillion-dollar class action settlement and nine years in bankruptcy protection, ending in June 2004.' },
        { when: '1992', title: 'R&D centralised in Midland', tag: 'Commercialisation', body: 'After 1992, decentralised R&D at a number of locations gives way to one central R&D location in Midland, Michigan. New products still take about four years to commercialise.' },
        { when: '1994', title: 'LEOP software, then a stop', tag: 'Focus on strengths', body: 'After 12 months and a significant amount of money spent trying to build its Legal Entity Ordering Payments software, Dow Corning stops developing software and focuses on silicone products.' },
        { when: '1995', title: 'SAP and the transformation program', tag: 'Transformation', body: 'It announces SAP and a program of transformation. Three areas need re-engineering; commercialisation of new products is one. By 1995 New Product Market Share has fallen to 13%.' },
        { when: '1997', title: 'Consultants redesign commercialisation', tag: 'Change management', body: 'A consulting company is hired to redesign the commercialisation process. Implementation is not successful: poor change management practices lead to poor take-up.' },
        { when: '1999', title: 'Abandoned for Lean Six Sigma', tag: 'Change management', body: 'Leadership abandons the new commercialisation process and focuses on the Lean Six Sigma implementation instead.' },
        { when: '2001', title: 'Design for Six Sigma', tag: 'New-product process', body: 'As part of Lean Six Sigma, Dow Corning decides to implement Design for Six Sigma. The ArmorAll Deck Protector becomes its pilot and the basis for all later commercialisation projects.' },
      ]}
      check={{
        question: 'Why was the commercialisation process designed in 1997 abandoned in 1999?',
        options: [
          { text: 'Poor change management led to poor take-up', correct: true, why: 'The slides say implementation failed because poor change management practices led to poor take-up of the new processes.' },
          { text: 'It was replaced by SAP', why: 'SAP was announced in 1995, before the redesign; the 1997 process was replaced by a focus on Lean Six Sigma.' },
          { text: 'ArmorAll refused to use it', why: 'ArmorAll appears later, as the customer for the DFSS pilot; it had no part in the 1997 process.' },
        ],
      }}
    />
  );
}
