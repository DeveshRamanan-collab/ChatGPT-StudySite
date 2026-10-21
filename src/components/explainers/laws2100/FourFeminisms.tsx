/*
SCENE: Four feminisms — one corridor, a shared hall then four rooms, each built in reply to the one before
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6
INTENT: Feminists share commitments but not a theoretical approach: liberal, difference, radical and postmodern
  feminism each answer a weakness of the one before and open one of their own.
SUBJECT: the amber light standing at the current room.
BEAT 1: the shared ground (law reflects, maintains, legitimises the patriarchy). BEAT 2: liberal (equal treatment; the
  male norm). BEAT 3: difference (ethics of care vs justice; stereotypes). BEAT 4: radical (women as a class with no
  voice; only victims?). BEAT 5: postmodern (essentialism, intersectionality; Naffine's two questions). BEAT 6: use.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts (Palace base). LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 5 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w08-four-feminisms; week 8 notes (slides 3–12); authority sex-discrimination-act-1984-cth.
*/
import { Palace } from '../bases/Palace';

export default function FourFeminisms() {
  return (
    <Palace
      label="Four feminisms, room by room: liberal, difference, radical, postmodern"
      terms={[
        { term: 'Patriarchy', def: 'Structures of society organised hierarchically in a way that subordinates women to men.' },
        { term: 'Formal vs substantive equality', def: 'Equal rules on paper versus equal positions in fact; the first did not deliver the second.' },
        { term: 'Essentialism', def: 'The flaw of generalising about women or assuming they share an essence and common interests.' },
        { term: 'Intersectionality', def: 'Race, culture, religion and class intersect to create different kinds of gender subordination.' },
      ]}
      loci={[
        { title: 'Hall · What they share', body: 'Despite their differences, feminist legal theorists see the law as a social system that reflects, maintains and legitimises the patriarchy: three verbs, three different claims. Feminists share interests and political commitments, but not the same theoretical approach.' },
        { title: 'Room 1 · Liberal feminism: equal treatment', body: 'A response to "separate spheres". Remove all formal barriers to women’s equal participation; assess individuals on their merits, not their group. Most legal gains of the 60s and 70s, eg the Sex Discrimination Act 1984 (Cth). The crack: formal equality did not become substantive equality, and the benchmark was the male norm.' },
        { title: 'Room 2 · Difference feminism: a different voice', body: 'Reacts to a formal equality that forces women to assimilate to patriarchal structures, acting like men. Carol Gilligan: ethics of care vs ethics of justice; the law should recognise women’s perspective and values. Contra: it can reinforce the stereotypes that caused women’s subordination.' },
        { title: 'Room 3 · Radical feminism: no voice at all', body: 'Catharine MacKinnon: women do not so much speak with a different voice; they have no voice at all. Women as a class are dominated by men as a class (a concept from Marxist analysis); sex oppression is the most fundamental domination. Pornography as a political issue. Contra: does it see women only as victims?' },
        { title: 'Room 4 · Postmodern feminism: no single woman', body: 'Distrust of grand narratives; deconstruction of male/female, reason/emotion, nature/culture. Rejects essentialism; adds intersectionality. Naffine’s questions: at what point do we know enough of each woman’s circumstances, and how can women’s situation improve if feminists will not speak for women? Some say: political paralysis.' },
        { title: 'Exit · Using the four', body: 'Each approach answers the one before and opens a new weakness. In an answer, name the approach before you criticise "feminism", and judge each by how well it explains, and helps change, a particular legal problem.' },
      ]}
      check={{
        question: 'Which approach replies that women do not speak with a different voice but have no voice at all?',
        options: [
          { text: 'Difference feminism', why: 'Difference feminism is the target of that reply: it says women speak with a different voice (Gilligan’s ethics of care).' },
          { text: 'Radical feminism', correct: true, why: 'MacKinnon’s radical feminism: women as a class are dominated by men as a class, so they have no voice at all.' },
          { text: 'Postmodern feminism', why: 'Postmodern feminism rejects talk of one women’s voice altogether (essentialism) and stresses intersecting identities.' },
        ],
      }}
    />
  );
}
