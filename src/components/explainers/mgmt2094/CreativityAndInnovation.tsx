/*
SCENE: Creativity versus innovation — thinking up new things, doing new things (Levitt)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the two facts → watch the path light → one check
INTENT: Make Levitt's line a two-question test — was something new thought up? was it actually done? — and place the
  week's examples in the cells it creates, on the slide's path vision → imagination → creativity → innovation.
SUBJECT: the creativity and innovation nodes at the end of the path; innovation lights only when both answers are yes.
BEAT 1 (0–100%): two toggles; the path nodes and the example line update within 200ms. Ease: CSS 180ms ease-out on
  colour only. Starts at "thought up, not done" (Imagineering's Dish), the case students most often misfile.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w01-creativity-and-innovation (Week 1 slides 13, 16, 17; lecture transcript; Lev-Ram 2015 on
  the Dish and MagicBands; dropshipping from slide 12).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  thought: boolean;
  done: boolean;
}

const initial: S = { thought: true, done: false };

const PATH = ['Vision', 'Imagination', 'Creativity', 'Innovation'] as const;

function cell(s: S) {
  if (s.thought && s.done)
    return { tone: 'yes' as const, head: 'Innovation', verdict: 'Innovation: a new thing actually done, built on the creativity that thought it up.', example: 'MagicBands, RFID wristbands rolled out at Disney World (more than 9 million given out); dropshipping, a simple idea someone came up with and implemented.' };
  if (s.thought)
    return { tone: 'open' as const, head: 'Creativity', verdict: 'Creativity: a new thing thought up, but not yet innovation, because it has not been done.', example: "Imagineering's Dish: virtual reality forests tested in the lab, still too expensive and cumbersome for the parks." };
  if (s.done)
    return { tone: 'no' as const, head: 'Neither', verdict: 'Doing, but nothing new: not innovation, which is doing new things.', example: 'A firm doing exactly what it has always done, however efficiently: repeating the same patterns.' };
  return { tone: 'no' as const, head: 'Neither', verdict: 'Nothing new thought up or done: forever repeating the same experiences and patterns, with no progress.', example: 'Slide 13: without creativity we would have no progress.' };
}

function view(s: S): SimView {
  const c = cell(s);
  const lit = (name: (typeof PATH)[number]) => (name === 'Creativity' ? s.thought : name === 'Innovation' ? s.thought && s.done : false);
  const figure = (
    <div className="xgates" role="group" aria-label="The path vision, imagination, creativity, innovation, with the nodes reached lit">
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(7.5rem, 1fr))', gap: 'var(--s-3)' }}>
        {PATH.map((name, i) => {
          const on = lit(name);
          const context = i < 2;
          return (
            <li key={name} data-node={name} data-on={on || undefined}
              style={{ padding: 'var(--s-3)', borderRadius: 'var(--r-md)', textAlign: 'center', background: 'var(--paper)', border: `1.5px ${context ? 'dashed' : 'solid'} ${on ? 'var(--sage)' : 'var(--ink-3)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
              <span className="mono" style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{i + 1}</span>
              <span style={{ display: 'block', fontWeight: 600, color: context ? 'var(--ink-2)' : 'var(--ink)' }}>{name}</span>
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
                {name === 'Creativity' ? 'thinking up new things' : name === 'Innovation' ? 'doing new things' : 'earlier on the path'}
              </span>
            </li>
          );
        })}
      </ol>
      <div style={{ marginTop: 'var(--s-4)', padding: 'var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)' }}>
        <p className="label" style={{ margin: 0 }}>From the materials · {c.head}</p>
        <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-sm)', lineHeight: 1.45, color: 'var(--ink)' }}>{c.example}</p>
      </div>
    </div>
  );
  return { figure, verdict: c.verdict, tone: c.tone };
}

function describe(a: S, b: S) {
  if (a.thought !== b.thought) return b.thought ? 'Something new is thought up: that is creativity (Levitt).' : 'Nothing new is thought up: there is no creativity, so nothing can become innovation either.';
  if (a.done !== b.done) return b.done ? 'It is actually done: if it is new, that is innovation; doing the same old thing is not.' : 'Not done: at most it is creativity, not yet innovation.';
  return '';
}

export default function CreativityAndInnovation() {
  return (
    <Simulation<S>
      label="Levitt's creativity and innovation as two questions on the semester's path"
      terms={[
        { term: 'Creativity', def: 'Thinking up new things (Theodore Levitt).' },
        { term: 'Innovation', def: 'Doing new things (Theodore Levitt).' },
        { term: 'The path', def: 'Vision → imagination → creativity → innovation (slide 16).' },
      ]}
      initial={initial}
      controls={[
        { key: 'thought', label: 'Something new is thought up', type: 'toggle' },
        { key: 'done', label: 'It is actually done (put into practice)', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: "Imagineering's Dish is tested in the lab but still too costly for the parks. On Levitt's terms it is:",
        options: [
          { text: 'Innovation, because the technology exists', why: 'Existing in a lab is not yet doing it for guests; Levitt’s innovation is doing new things.' },
          { text: 'Creativity, not yet innovation', correct: true, why: 'A new thing thought up and tested but not yet done in the parks is creativity: thinking up new things.' },
          { text: 'Neither, because VR hardware is not new', why: 'Using existing hardware in a new way to test rides is still thinking up something new.' },
        ],
      }}
    />
  );
}
