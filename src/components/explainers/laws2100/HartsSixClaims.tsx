/*
SCENE: Hart's six claims — the "necessary connection" broken into six rooms, two with open doors
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6
INTENT: Hart splits the necessary connection between law and morality into six separate claims (CL ch IX) and
  concedes two of them — influence of morality and principles of legality — without conceding a conceptual link.
SUBJECT: the amber light standing at the current room; rooms 2 and 5 are marked "conceded".
BEAT 1: power and authority (acceptance is not moral approval). BEAT 2: influence of morality (conceded, contingent).
  BEAT 3: interpretation. BEAT 4: criticism of law. BEAT 5: principles of legality and justice (conceded; "compatible
  with very great iniquity"). BEAT 6: validity and resistance.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w04-harts-six-claims; authority hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function HartsSixClaims() {
  return (
    <Palace
      label="Hart's six claims about law and morality, room by room; rooms 2 and 5 conceded"
      terms={[
        { term: 'Necessary connection (NCLM)', def: 'The natural-law claim that law and morality are linked in some sense that must hold.' },
        { term: 'Conceded', def: 'Hart: if this is what the necessary connection means, its existence should be conceded.' },
        { term: 'Contingent', def: 'True of some systems as a matter of fact, not true of law as such.' },
      ]}
      loci={[
        { title: 'Room 1 · Power and authority', body: 'Coercive power presupposes accepted authority — the internal point of view. But allegiance may rest on "calculations of long-term interest", tradition, or "the mere wish to do as others do" (CL 203). Acceptance need not be moral approval; a legal system exists when valid rules are generally obeyed and officials effectively accept the secondary rules (CL 109).' },
        { title: 'Room 2 · Influence of morality (conceded)', body: 'Some systems (the United States) build principles of justice into the ultimate criteria of validity; elsewhere (England) legislation may conform to morality just as scrupulously. "No \'positivist\' could deny that these are facts" (CL 204) — but the link is contingent.' },
        { title: 'Room 3 · Interpretation', body: 'The third of the six claims. Name it precisely: an argument about interpretation is not an argument about the necessary connection in general.' },
        { title: 'Room 4 · Criticism of law', body: 'The fourth claim. Keep it separate from the others; each claim stands or falls on its own.' },
        { title: 'Room 5 · Principles of legality and justice (conceded)', body: 'Perhaps "a minimum of justice is necessarily realized whenever human behaviour is controlled by general rules publicly announced and judicially applied" (CL 206) — Fuller\'s inner morality. Hart accepts it, but it "is unfortunately compatible with very great iniquity" (CL 207).' },
        { title: 'Room 6 · Validity and resistance', body: 'The sixth claim. As with rooms 3 and 4, say which claim you are addressing before you argue about it.' },
      ]}
      check={{
        question: 'An essay argues "Hart denies any necessary connection between law and morality." What is the best correction?',
        options: [
          { text: 'Hart concedes the connection in every sense', why: 'He concedes only claims (2) and (5); on power and authority he insists acceptance need not be moral approval.' },
          { text: 'Name the claim: Hart concedes influence of morality and principles of legality, but not as a conceptual link', correct: true, why: 'Hart breaks the connection into six claims; exam answers should never argue "the necessary connection" in general.' },
          { text: 'Hart accepts the connection because officials must morally approve the rules', why: 'Allegiance may rest on self-interest, tradition or conformity (CL 203).' },
        ],
      }}
    />
  );
}
