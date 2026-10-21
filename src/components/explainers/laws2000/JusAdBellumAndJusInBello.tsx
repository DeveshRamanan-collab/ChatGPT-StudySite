/*
SCENE: From just war to the Charter — each attempt to restrain war, the war that followed, and the split into two laws
LENGTH: not pinned — a draggable Timeline (learner-paced), 6 events
BEATS: terms → Aquinas (13th century) → Hague 1899/1907 → League 1920 → Kellogg-Briand 1928 → UN Charter 1945 →
  the split: jus ad bellum (may force be used?) and jus in bello (how must hostilities be conducted?) → one check
INTENT: Fix that jus ad bellum is the law on the resort to force, built up through failed attempts to restrain war and
  settled in the 1945 Charter, and that it is a different question from jus in bello.
SUBJECT: the handle; the tag under each event says what the step did and what followed it.
BEAT 1–6: drag, click or arrow to an event; its detail fades in beneath the track (base, ≤ 240ms, ease-out).
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: the handle jumps instead of gliding (base); same controls, same captions.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2000-w09-jus-ad-bellum-and-jus-in-bello; Week 9 slides 4–6; kellogg-briand-pact-1928 authority;
  tutorial Q1. Dates only where the slides give them.
*/
import { Timeline } from '../bases/Timeline';

export default function JusAdBellumAndJusInBello() {
  return (
    <Timeline
      label="Attempts to restrain the resort to war, from Aquinas to the UN Charter, and the split between jus ad bellum and jus in bello"
      terms={[
        { term: 'Jus ad bellum', def: 'The law relating to the resort to force and war — when a state may use force.' },
        { term: 'Jus in bello', def: 'The law regulating behaviour during hostilities — international humanitarian law.' },
        { term: 'Just war', def: 'Aquinas’s doctrine: a war is just only with the right authority, purpose and intent.' },
      ]}
      events={[
        { when: '13th century', title: 'Aquinas’s just war doctrine', tag: 'Moral conditions', body: 'Three conditions for a war to be just: auctoritas — the right authority (the rightful sovereign); causa justa — a just purpose (not the pursuit of wealth or power); recta intentio — the right intent (the attainment of a just peace).' },
        { when: '1899, 1907', title: 'The Hague Conventions', tag: 'Then the First World War', body: 'Early international efforts to limit the right to war, though mostly about what is permissible once at war. The First World War followed.' },
        { when: '1920', title: 'The League of Nations (1920–1945)', tag: 'The first organisation to limit war', body: 'The UN’s predecessor and the first international organisation created with the idea of limiting the recourse to war — though it did not go as far as the UN Charter.' },
        { when: '1928', title: 'The Kellogg-Briand Pact', tag: 'Then the Second World War', body: 'Outlawed war as a means of national policy, except for self-defence. The Second World War followed about ten years later.' },
        { when: '1945', title: 'The UN Charter', tag: 'The framework today', body: 'Reflecting the experience of the Second World War, the peoples of the United Nations were “determined to save succeeding generations from the scourge of war”: peaceful settlement (art 2(3)), a prohibition on the threat or use of force (art 2(4)), and only two exceptions (arts 42 and 51).' },
        { title: 'Two questions, two bodies of law', tag: 'Ad bellum · in bello', body: 'Jus ad bellum asks whether force may be used at all — art 2(4), art 42, art 51, this unit. Jus in bello asks how hostilities must be conducted once they have begun — international humanitarian law, the Geneva Conventions, taught in the Law of Armed Conflict elective.' },
      ]}
      check={{
        question: 'Which of these is a jus in bello question rather than a jus ad bellum one?',
        options: [
          { text: 'Was State A entitled to respond to B’s armed attack with force?', why: 'Whether a state may resort to force (here, self-defence under art 51) is the jus ad bellum question.' },
          { text: 'Were the prisoners State A captured treated as the rules of war require?', correct: true, why: 'How prisoners are treated once fighting has begun is behaviour during hostilities — jus in bello, international humanitarian law.' },
          { text: 'Did the Security Council authorise force against State B under art 42?', why: 'Security Council authorisation is one of the two Charter exceptions to art 2(4) — a question of jus ad bellum.' },
        ],
      }}
    />
  );
}
