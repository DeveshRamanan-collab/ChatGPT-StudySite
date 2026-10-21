/*
SCENE: Hart's reply to Devlin — the exchange as a timeline, ending on Hart's tests
LENGTH: not pinned — a Timeline (learner-paced: drag, click or arrow keys)
BEATS: 7 events: Wolfenden (1957) → Devlin's lecture (1959) → 'Immorality and Treason' (1959) → Law, Liberty and
  Morality (1963) → The Enforcement of Morals (1965) → The Morality of the Criminal Law (1965) → the deeper criticism
INTENT: The debate is an exchange of moves: Devlin's social-cohesion case, then Hart's attack on Devlin's idea of
  morality, his two questions and the seamless web, and his demand that moral claims be rationally assessed.
SUBJECT: the timeline handle and the move made at each point.
BEAT 1–7: each event's detail fades in beneath the track (base: opacity; handle glide 350ms, 120ms calm).
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: no glide; same controls (base).
BUDGET: < 4 KB gz.
Source: concept laws2100-w10-harts-reply-to-devlin; authorities hart-immorality-and-treason, wolfenden-report-1957
  (slides 20, 24–26). The slides do not tie Hart's two questions or the deeper criticism to one text, so those
  events say "across the exchange".
*/
import { Timeline } from '../bases/Timeline';

export default function HartsReplyToDevlin() {
  return (
    <Timeline
      label="The Hart–Devlin exchange, 1957 to 1965"
      terms={[
        { term: 'Seamless web', def: 'Devlin\'s picture of morality as one whole that falls if any part is not enforced; Hart denies it.' },
        { term: 'Reprobation', def: 'Moral disapproval; Devlin\'s test reads it from feelings of intolerance, indignation and disgust.' },
        { term: 'Rational criticism', def: 'Assessing a moral claim by reason, sympathetic understanding and critical intelligence.' },
      ]}
      events={[
        { when: '1957', title: 'The Wolfenden report', tag: 'UK committee', body: 'The Departmental Committee on Homosexual Offences and Prostitution recommended that "homosexual behaviour between consenting adults in private should no longer be a criminal offence".' },
        { when: '1959', title: 'Devlin, \'Morals and the Criminal Law\'', tag: 'Devlin', body: 'The Maccabean Lecture at the British Academy: shared morality is necessary to society, so it may be enforced by law, with its content read from the jury box\'s intolerance, indignation and disgust, and no more limits than on laws against treason.' },
        { when: '1959', title: 'Hart, \'Immorality and Treason\'', tag: 'Hart', body: '"The most remarkable feature of Sir Patrick\'s lecture is his view of the nature of morality – the morality which the criminal law may enforce". Is morality really a compound of intolerance, indignation and disgust, "a real feeling of reprobation"?' },
        { when: '1963', title: 'Hart, Law, Liberty and Morality', tag: 'Hart', body: 'Across the exchange Hart holds that morality is not a seamless web and asks two questions: is this behaviour, which offends moral feelings, harmful (independently of its effect on the moral code)? If we do not criminalise it, will we jeopardise the whole fabric of morality and society? So the treason analogy fails.' },
        { when: '1965', title: 'Devlin, The Enforcement of Morals', tag: 'Devlin', body: 'Devlin\'s book-length defence of his position in the exchange.' },
        { when: '1965', title: 'Hart, The Morality of the Criminal Law', tag: 'Hart', body: 'Hart\'s further reply, the last item in the exchange as listed on the slides.' },
        { title: 'The deeper criticism', tag: 'Hart', body: 'It must be possible to rationally assess the claim that immoral behaviour should be punished. Is general morality based on ignorance, superstition or misunderstanding? Is the practice falsely thought dangerous to society? Are the misery and evil consequences of criminal punishment well understood?' },
      ]}
      check={{
        question: 'What does Hart attack first in \'Immorality and Treason\'?',
        options: [
          { text: 'Devlin\'s view of the nature of morality', correct: true, why: 'Hart\'s opening line names it as "the most remarkable feature" of Devlin\'s lecture: a morality of feelings of reprobation.' },
          { text: 'Devlin\'s rejection of the harm principle', why: 'Hart does not lead with the harm principle; starting there would only set a liberal premise against Devlin\'s opposite one.' },
          { text: 'The Wolfenden report\'s recommendation', why: 'Hart is not attacking Wolfenden; the debate is over Devlin\'s criticism of its recommendation.' },
        ],
      }}
    />
  );
}
