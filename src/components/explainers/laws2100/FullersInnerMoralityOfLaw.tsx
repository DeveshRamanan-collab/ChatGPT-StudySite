/*
SCENE: Fuller's inner morality of law — eight rooms of legality, then order versus good order
LENGTH: 9 loci; pinned 540vh on desktop (scroll walks), paced otherwise
BEATS: 9
INTENT: Law is the enterprise of subjecting conduct to the governance of rules, so it must meet eight procedural
  demands; Rex fails not on content but because nobody could comply. The last room sets good order against order,
  with Hart's reply.
SUBJECT: the amber light standing at the current room.
BEAT 1–8: general, public, prospective, clear, coherent, practicable, stable, congruence. BEAT 9: order vs good order;
  Hart: "compatible with very great iniquity".
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the nine loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w04-fullers-inner-morality-of-law; week spec laws2100-w04 (Rex); authorities
  fuller-positivism-and-fidelity-to-law, fuller-the-morality-of-law, hart-positivism-and-the-separation-of-law-and-morals.
*/
import { Palace } from '../bases/Palace';

const P = (n: number, word: string, text: string) => ({ title: `Room ${n} · ${word}`, body: text });

export default function FullersInnerMoralityOfLaw() {
  return (
    <Palace
      label="Fuller's eight principles of legality, walked room by room, ending at order versus good order"
      terms={[
        { term: 'Procedural natural law', def: "Fuller's kind: law must meet moral standards of form, not of content." },
        { term: 'Inner morality', def: 'The morality within law, which law must comply with to be law — not an external yardstick.' },
        { term: 'Order vs good order', def: 'Fuller: most issues in the debate "can be restated" in these terms (644).' },
      ]}
      loci={[
        P(1, 'General', 'Laws must be general. At the start of The Morality of Law, Rex tries to govern case by case and fails — not because his laws are unjust, but because nobody could comply.'),
        P(2, 'Public', 'Laws must be public. The test is the one Rex fails: could anyone comply with rules that are not public?'),
        P(3, 'Prospective', 'Laws must be prospective. The test is the one Rex fails: could anyone comply with rules that are not prospective?'),
        P(4, 'Clear', 'Laws must be clear. The test is the one Rex fails: could anyone comply with rules that are not clear?'),
        P(5, 'Coherent', 'Laws must be coherent. The test is the one Rex fails: could anyone comply with rules that are not coherent?'),
        P(6, 'Practicable', 'Laws must be practicable. The test is the one Rex fails: could anyone comply with rules that are not practicable?'),
        P(7, 'Stable', 'Laws must be stable. The test is the one Rex fails: could anyone comply with rules that are not stable?'),
        P(8, 'Congruence', 'Finally, there must be congruence between official action and the law. Under Hitler, officials acted "through the party in the streets" (652).'),
        { title: 'The last room · Good order', body: 'Following the principles treats subjects as autonomous rational beings, which carries a moral dimension: good order, not bare order. Hart accepts the inner morality, but it is "compatible with very great iniquity" (CL 207).' },
      ]}
      check={{
        question: 'In what sense is Fuller\'s inner morality "inner"?',
        options: [
          { text: 'It is a morality within law, which law must comply with to be law', correct: true, why: 'It is not an external morality used to evaluate law; the definition names no content.' },
          { text: 'It is the private conscience of each judge', why: 'The principles bind the lawmaking enterprise as a whole, including congruence of official action.' },
          { text: 'It requires every law to be just in content', why: 'Rex fails not because his laws are unjust but because nobody could comply — the principles are procedural.' },
        ],
      }}
    />
  );
}
