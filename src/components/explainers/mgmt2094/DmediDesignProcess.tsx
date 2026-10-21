/*
SCENE: DMEDI — the Six Sigma design process, walked as five rooms
LENGTH: 5 loci; scroll walks the corridor when pinned (desktop, full motion); Next/Back or ← → otherwise (Palace base)
INTENT: Fix the five steps in order — Define, Measure, Explore, Develop, Implement — each with its objective, one
  signature tool and its key deliverable, so a scenario can be placed in its step.
SUBJECT: the amber light at the current locus; the panel names the step and what happens there.
BEAT 1–5: one locus per step, alternating walls; the camera dollies to each (yaw ≤ 15°, base-controlled).
CAMERA: base corridor camera, gentle dolly only. LIGHT: one amber point at the current locus. SOUND: none.
REDUCED MOTION: off / no WebGL — the five loci as a numbered list.
BUDGET: Palace base (Three.js shared chunk); this module < 4 KB gz.
Source: Week 9 slide 12 (Six Sigma Design Process – DMEDI: objectives, main activities, tools, key deliverables,
on-going activities); concept mgmt2094-w09-dmedi-design-process.
*/
import { Palace } from '../bases/Palace';

export default function DmediDesignProcess() {
  return (
    <Palace
      label="DMEDI: the five steps of the Six Sigma design process"
      terms={[
        { term: 'Voice of the customer (VOC)', def: 'What customers say they need, captured in research.' },
        { term: 'CCRs', def: 'Critical-to-customer requirements: customer needs translated into measurable requirements.' },
        { term: 'QFD', def: 'Quality Functional Deployment: the matrix used to turn needs into requirements.' },
        { term: 'Best-fit concept', def: 'The alternative chosen in Explore to take into detailed design.' },
      ]}
      loci={[
        { title: '1 · Define', body: 'Understand the purpose. Develop a charter, a multi-generational product/service plan and a project plan to manage the project. Tools: charter, Gantt chart, in-and-out-of-scope tool, communications plan.' },
        { title: '2 · Measure', body: 'Research customers and capture the voice of the customer; translate needs into critical-to-customer requirements using QFD; benchmark competitor performance; set target sigma performance. Deliverable: CCR definition.' },
        { title: '3 · Explore', body: 'Translate CCRs into functions; use creative techniques to develop alternative concepts; compare them (eg with a Pugh matrix) and select the best-fit concept; assess the risk of the high-level design.' },
        { title: '4 · Develop', body: 'Detailed designs, capability assessments, FMEA, design of experiments (DOE), process control plans and pilot plans. Deliverable: detailed product and production process design.' },
        { title: '5 · Implement', body: 'Execute the pilot and validation plans; make the scale-up decision; transition to process owners; document lessons learned; reward and recognise. Alongside every step: change management, customer and strategy alignment, project management.' },
      ]}
      check={{
        question: 'In which DMEDI step are customer needs translated into critical-to-customer requirements using QFD?',
        options: [
          { text: 'Define', why: 'Define sets up the charter and project plan; customer research comes in the next step.' },
          { text: 'Measure', correct: true, why: 'Measure researches customers, captures the voice of the customer and translates needs into CCRs with a QFD matrix.' },
          { text: 'Explore', why: 'Explore starts from the CCRs and turns them into functions and concepts; it does not create them.' },
        ],
      }}
    />
  );
}
