/*
SCENE: History and foundations of international human rights law — from Magna Carta to the UN Charter
LENGTH: not pinned — a draggable Timeline (learner-paced), 8 events
BEATS: terms → drag from 1215 to the Charter → each node names the instrument or idea and what it added → one check
INTENT: Show protection moving from domestic instruments and Enlightenment ideas, through issue-specific treaties, to
  the UN Charter making human rights a general purpose of the international community.
SUBJECT: the handle; events up to it are inked, the rest wait in faint line.
BEAT 1 (events 1–4): domestic instruments and the Enlightenment (1215, 1689, 1785, 1789–91).
BEAT 2 (events 5–6): issue-specific international protection — abolition (1807) and the 1926 Slavery Convention.
BEAT 3 (events 7–8): WW2 and the Nazi regime, then the Charter (arts 1(3), 55(c), 56). Ease: base glide, power2.out.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: off — the handle jumps instead of gliding (base); same controls, same detail text.
BUDGET: < 5 KB gz, no WebGL. Undated events (WW2, the Charter) show "·" because the Week 12 slides give no year.
Source: concept laws2000-w12-history-and-foundations-of-human-rights; authorities un-charter-art-1-3,
  un-charter-arts-55-56; Week 12 lecture slides 3–6.
*/
import { Timeline } from '../bases/Timeline';

export default function HistoryAndFoundationsOfHumanRights() {
  return (
    <Timeline
      label="Timeline of human rights from Magna Carta in 1215 to the UN Charter"
      terms={[
        { term: 'Early instruments', def: 'Domestic texts that came before international protection — Magna Carta, the English and US Bills of Rights, the French Declaration.' },
        { term: 'Dignity (Kant)', def: 'Every person has inherent value, so must be treated as an end and never merely as a means.' },
        { term: 'Issue-specific protection', def: 'Early international law protected particular groups or problems — slavery, trafficking — not human rights in general.' },
        { term: 'Purposes of the UN', def: 'The aims set out in art 1 of the Charter; art 1(3) includes promoting respect for human rights.' },
      ]}
      events={[
        { when: '1215', title: 'Magna Carta', tag: 'Early instruments', body: 'The oldest of the early instruments the lecture lists — a domestic text, long before the beginning of international human rights.' },
        { when: '1689', title: 'English Bill of Rights; Locke’s Two Treatises of Government', tag: 'Enlightenment', body: 'Locke defends the claim that people are by nature free and equal, not made subject to a monarch by God, and argues that rights to life, liberty and property have a foundation independent of the laws of any particular society.' },
        { when: '1785', title: 'Kant, Groundwork for the Metaphysics of Morals', tag: 'Enlightenment', body: 'All persons have an inherent value, or dignity, which limits how others may treat them: human beings must be treated “as an end” and “never merely as a means”.' },
        { when: '1789', title: 'French Declaration; US Constitution (1789) and Bill of Rights (1791)', tag: 'Early instruments', body: 'The Declaration of the Rights of Man and of the Citizen and the US Constitution (both 1789), then the US Bill of Rights (1791) — still domestic protection.' },
        { when: '1807', title: 'Britain abolishes slavery', tag: 'Issue-specific', body: 'The beginning of international human rights, but issue-specific: abolition spreads to other European countries. Limited women’s rights work (trafficking in women for prostitution) belongs to the same phase.' },
        { when: '1926', title: 'Slavery Convention', tag: 'Issue-specific', body: 'Abolition becomes a treaty obligation — still protection for one issue, not human rights in general.' },
        { title: 'The Second World War and the Nazi regime', tag: 'Turning point', body: 'The last item on the lecture’s 19th–20th century slide, immediately before the UN Charter turns to human rights.' },
        { title: 'UN Charter arts 1(3), 55(c) and 56', tag: 'General protection', body: 'Promoting respect for human rights “for all without distinction as to race, sex, language, or religion” becomes a Purpose of the UN (art 1(3)); the UN shall promote their universal respect and observance (art 55(c)); every Member pledges joint and separate action to that end (art 56).' },
      ]}
      check={{
        question: 'Where does the lecture first place human rights as a general concern of the international community, rather than an issue-specific one?',
        options: [
          { text: 'The 1926 Slavery Convention', why: 'It is an international treaty, but the lecture calls this phase issue-specific: it protects against slavery, not human rights in general.' },
          { text: 'The UN Charter, arts 1(3), 55(c) and 56', correct: true, why: 'The Charter makes promoting respect for human rights “for all” a Purpose of the UN and commits every Member to joint and separate action.' },
          { text: 'Magna Carta (1215)', why: 'It is the oldest instrument on the list, but the lecture treats it as an early domestic instrument, before international protection began.' },
        ],
      }}
    />
  );
}
