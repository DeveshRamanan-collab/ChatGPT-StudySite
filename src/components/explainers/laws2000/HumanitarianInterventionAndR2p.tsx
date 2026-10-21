/*
SCENE: Humanitarian intervention and R2P — from failures to protect, through Kosovo, to a responsibility that works
  through the UN, and a grey area that remains
LENGTH: not pinned — a draggable Timeline (learner-paced), 8 events
BEATS: terms → the Charter's silence → Rwanda 1994 → Srebrenica 1995 → Kosovo 1999 → ICISS 2001 → World Summit 2005 →
  Libya 2011 → ILA 2018 → one check
INTENT: Fix that unilateral humanitarian intervention has no Charter basis, that Kosovo was called "illegal, yet
  legitimate", and that R2P reframes the question as a responsibility exercised through UN mechanisms.
SUBJECT: the handle; each event's tag names the move (failure, intervention, reframing, criticism, status).
BEAT 1–8: drag, click or arrow to an event; its detail fades in beneath the track (base).
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: the handle jumps instead of gliding (base); same controls, same captions.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2000-w09-humanitarian-intervention-and-r2p; Week 9 slides 29–36; authorities iciss-report-2001,
  world-summit-outcome-2005, ila-2018-report, un-charter-art-2-4, un-charter-art-24.
*/
import { Timeline } from '../bases/Timeline';

export default function HumanitarianInterventionAndR2p() {
  return (
    <Timeline
      label="Humanitarian intervention and the responsibility to protect, from the Charter’s silence to the ILA’s legal grey area"
      terms={[
        { term: 'Humanitarian intervention', def: 'Force to protect people in another state from gross and systematic human rights violations.' },
        { term: 'R2P', def: 'The responsibility to protect populations from genocide, war crimes, ethnic cleansing and crimes against humanity.' },
        { term: 'Unwilling or unable', def: 'When the state fails its population, the international responsibility is engaged.' },
      ]}
      events={[
        { title: 'The Charter is silent', tag: 'The problem', body: 'Humanitarian intervention is not addressed in the UN Charter and appears to conflict with the general prohibition in art 2(4). The Security Council, with primary responsibility for peace (art 24), can deadlock: the permanent members hold a veto.' },
        { when: '1994', title: 'Rwanda', tag: 'Failure to protect', body: 'The Rwandan genocide — one of the prominent failures to protect that brought the humanitarian intervention debate to the fore in the 1990s.' },
        { when: '1995', title: 'Srebrenica', tag: 'Failure to protect', body: 'The UN’s inability to halt the massacre in Srebrenica, Bosnia.' },
        { when: '1999', title: 'NATO in Kosovo', tag: 'Intervention without authorisation', body: 'NATO intervened without Security Council authorisation. The UK argued it was legal “as an exceptional measure on grounds of overwhelming humanitarian necessity”; a draft resolution called it a flagrant violation of arts 2(4), 24 and 53. The Independent International Commission on Kosovo: “illegal, yet legitimate”.' },
        { when: '2001', title: 'The ICISS report', tag: 'Reframing', body: 'Initiated by Canada and chaired by Gareth Evans and Mohamed Sahnoun, the ICISS shifted the language from a right to intervene to a responsibility to protect: sovereignty implies responsibility; when a state is unwilling or unable, the international responsibility is to prevent, to react (force as a last resort) and to rebuild.' },
        { when: '2005', title: 'World Summit Outcome', tag: 'Three pillars', body: 'R2P endorsed: (1) governments’ primary duty to protect their populations, citizens or not, from the four crimes; (2) international assistance, e.g. capacity-building; (3) the responsibility to respond through the UN mechanisms. The P5 are only asked to “refrain” from the veto.' },
        { when: '2011', title: 'Libya', tag: 'Criticism', body: 'NATO’s use of force led to the fall of Gaddafi — criticised as forcible regime change. Other critiques: selective application (why not Syria or Myanmar?), unrealistic expectations, abuse by powerful states, a return to just war.' },
        { when: '2018', title: 'ILA report', tag: 'Status today', body: 'Humanitarian intervention remains a “legal grey area”. Unilateral force has no Charter basis; R2P works within the Charter’s collective security system, not beside it.' },
      ]}
      check={{
        question: 'Does R2P give a state a legal right to use force unilaterally to stop atrocities in another state?',
        options: [
          { text: 'Yes — once one of the four crimes is occurring, any state may intervene', why: 'R2P is tied to the four crimes, but its third pillar is a response through the UN mechanisms, not a unilateral licence.' },
          { text: 'No — its third pillar is a response through UN mechanisms; unilateral force remains a grey area', correct: true, why: 'R2P works within the Charter’s collective security system, and the ILA (2018) still calls humanitarian intervention a legal grey area.' },
          { text: 'Yes — Kosovo established it as a third exception to art 2(4)', why: 'The Kosovo Commission called NATO’s action “illegal, yet legitimate” — it did not create a new Charter exception.' },
        ],
      }}
    />
  );
}
