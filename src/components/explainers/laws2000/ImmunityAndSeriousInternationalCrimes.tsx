/*
SCENE: Immunity, impunity and international crimes — Pinochet to ILC draft article 7
LENGTH: 5 events, learner-dragged (Timeline base)
INTENT: Whether immunity yields to an international crime depends on who (state or official), what (civil or
  criminal) and when (serving or former): lifted for a former head of state over torture, upheld for a serving
  minister and for a state in civil proceedings, with a contested ILC proposal at the end.
SUBJECT: the handle; each event's tag reads "who · proceedings · upheld or lifted".
EVENTS: Pinochet (No 3) 1999 → Arrest Warrant 2002 → "immunity is not impunity" (four avenues, from Arrest Warrant)
  → Germany v Italy 2012 → ILC draft art 7 2017.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 6 KB gz. Dates only where the concept card gives them.
Source: concept laws2000-w06-immunity-and-serious-international-crimes; Pinochet (No 3), Arrest Warrant,
  Germany v Italy; ILC draft art 7.
*/
import { Timeline } from '../bases/Timeline';

export default function ImmunityAndSeriousInternationalCrimes() {
  return (
    <Timeline
      label="Immunity and serious international crimes, 1999 to 2017"
      terms={[
        { term: 'Procedural bar', def: 'Immunity stops the court hearing the case; it says nothing about substantive responsibility.' },
        { term: 'Personal immunity', def: 'The immunity of a serving senior official, such as a foreign minister, covering all acts.' },
        { term: 'Universal jurisdiction', def: 'Jurisdiction any state may exercise over certain crimes, such as torture under the Convention against Torture.' },
      ]}
      events={[
        { when: '1999', title: 'Pinochet (No 3)', tag: 'former official · criminal · lifted', body: 'The House of Lords held that a former head of state has no immunity for acts that, when done, were international crimes subject to a form of universal jurisdiction — torture under the Convention against Torture, to which the UK, Chile and Spain were parties.' },
        { when: '2002', title: 'Arrest Warrant (DRC v Belgium)', tag: 'serving official · criminal · upheld', body: 'A Belgian warrant for the sitting Congolese foreign minister breached his personal immunity. State practice supports no exception for international crimes.' },
        { when: '2002', title: 'Immunity does not mean impunity', tag: 'Arrest Warrant', body: 'Immunity is procedural; criminal responsibility is substantive. Prosecution remains possible (1) in the person’s own state, (2) after waiver, (3) by other states once they leave office, for acts before or after office and private acts during it, and (4) before international criminal courts.' },
        { when: '2012', title: 'Germany v Italy', tag: 'state · civil · upheld', body: 'Custom did not deprive Germany of immunity in Italian civil proceedings over WWII crimes by its armed forces. State immunity is “procedural in character” (para 93) and covers acts jure imperii by armed forces in armed conflict, even on the forum state’s territory (para 77).' },
        { when: '2017', title: 'ILC draft article 7', tag: 'officials · criminal · proposed', body: 'Would exclude immunity for genocide, crimes against humanity, war crimes, torture and enforced disappearances — but whether it reflects state practice is debated.' },
      ]}
      check={{
        question: 'Why did Pinochet lose immunity when the Congolese minister in Arrest Warrant kept it?',
        options: [
          { text: 'Pinochet was a former head of state; the minister was serving and had personal immunity', correct: true, why: 'Serving or former is decisive: a former official has no immunity for torture subject to universal jurisdiction, while a serving minister keeps personal immunity.' },
          { text: 'Germany v Italy held that international crimes remove all immunity', why: 'Germany v Italy upheld state immunity in civil proceedings, even for WWII crimes.' },
          { text: 'ILC draft article 7 applied to Pinochet', why: 'Draft article 7 dates from 2017, and whether it reflects state practice is debated.' },
        ],
      }}
    />
  );
}
