/*
SCENE: Six practices for leaders who want agile to work — a corridor walk
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks the corridor), paced Next/Back otherwise
BEATS: 6 (one per practice, in the reading's order)
INTENT: Fix the order of Rigby, Sutherland and Takeuchi's six practices and hang one real example on each, so a
  stalled-agile scenario can be diagnosed practice by practice.
SUBJECT: the amber light standing at the current frame.
BEAT 1: Learn how agile really works — neither anarchy nor 'doing what I say, only faster'.
BEAT 2: Understand where agile does or does not work — not a panacea; routine operations suit it less.
BEAT 3: Start small and let the word spread — John Deere, from corporate IT in 2004.
BEAT 4: Allow 'master' teams to customise — shu-ha-ri; Spotify's squads.
BEAT 5: Practise agile at the top — Systematic, GE Digital, Mission Bell Winery.
BEAT 6: Destroy the barriers — one boss per decision; the stalled financial-services app pilot.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the frame, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the six practices as a numbered list (no WebGL), captions in full.
BUDGET: own chunk < 6 KB gz (three is the shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w10-leading-agile; content-src/mgmt2094-w10.yaml notes "Six practices for leaders";
  example cards mgmt2094-example-john-deere, -spotify, -systematic, -ge-digital, -mission-bell-winery,
  -financial-services-app-pilot.
*/
import { Palace } from '../bases/Palace';

export default function LeadingAgile() {
  return (
    <Palace
      label="A corridor with six frames: the six practices leaders need for agile to work"
      terms={[
        { term: 'Command-and-control', def: 'Managers set tasks and review decisions; agile is a radical alternative to it.' },
        { term: 'Initiative owner', def: 'The person responsible for delivering value, who rank-orders the backlog.' },
        { term: 'Shu-ha-ri', def: 'Master the proven forms (shu), modify them (ha), then improvise (ri).' },
        { term: 'Enterprise backlog', def: 'One ranked list of the organisation’s priorities that every team works from.' },
      ]}
      loci={[
        { title: '1 · Learn how agile really works', body: 'Agile is neither anarchy (everybody does what they want) nor ‘doing what I say, only faster’. Executives who only know the vocabulary keep managing in ways that undermine their teams.' },
        { title: '2 · Understand where agile does or does not work', body: 'Agile is not a panacea. It fits complex problems with unknown solutions, modular work and close customer feedback; it fits routine operations such as plant maintenance or accounting far less.' },
        { title: '3 · Start small and let the word spread', body: 'John Deere: George Tome began in corporate IT in 2004; over years agile spread to other units, then to marketing and R&D, helped by a coach for non-software staff and weekly one-page articles.' },
        { title: '4 · Allow ‘master’ teams to customise their practices', body: 'Master the proven practices first (shu-ha-ri); stable teams beat rotating ones. Spotify’s squads drop burndown charts because they tested the change and it improved results.' },
        { title: '5 · Practise agile at the top', body: 'Systematic’s executives moved to daily 20-minute stand-ups; at GE Digital the COO is initiative owner; Mission Bell Winery’s executive team ranks one enterprise backlog and keeps pet projects in their place.' },
        { title: '6 · Destroy the barriers to agile behaviours', body: 'One list of priorities for every function, roles changed before structures, one boss per decision, teams over individuals, questions over orders. A praised app stalled for months in waterfall testing queues.' },
      ]}
      check={{
        question: 'Executives keep overturning an agile team’s decisions and adding review layers. Which practice are they breaking most directly?',
        options: [
          { text: 'Start small and let the word spread', why: 'Starting small is about how agile is introduced; overturning decisions is a barrier the executives themselves create.' },
          { text: 'Destroy the barriers to agile behaviours', correct: true, why: 'Name one boss per decision and don’t second-guess the owner: overturning decisions and adding review layers are the barriers this practice removes.' },
          { text: 'Allow master teams to customise their practices', why: 'Customising concerns experienced teams adapting agile; the problem here is leaders undermining the team’s decisions.' },
        ],
      }}
    />
  );
}
