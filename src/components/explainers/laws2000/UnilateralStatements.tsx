/*
SCENE: Unilateral statements — one arrow out, no arrow back, against a treaty's two-way exchange
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: A public declaration can bind the declaring state with no reciprocity or acceptance — the defining difference
  from a treaty — and it is not a reservation.
SUBJECT: the single outward arrow.
BEAT 1 (0–25%): treaty: two states, arrows both ways.
BEAT 2 (25–50%): a state's declaration; the arrow grows outward (scaleX, scrubbed, ease none); no return arrow.
BEAT 3 (50–75%): Eastern Greenland and Nuclear Tests.
BEAT 4 (75–100%): not a reservation — a reservation modifies an existing treaty relationship.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz.
Source: concept laws2000-w03-unilateral-statements; case cards legal-status-of-eastern-greenland-denmark-v-norway,
  nuclear-tests-cases-australia-v-france-new-zealand-v-france.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const on = (t: number, at: number) => Math.max(0, Math.min(1, t - at));
const box = { fill: 'var(--paper-2)', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const d = x2 > x1 ? -8 : 8;
  return <path d={`M ${x1} ${y} L ${x2} ${y} M ${x2 + d} ${y - 5} L ${x2} ${y} L ${x2 + d} ${y + 5}`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />;
}

function scene(t: number) {
  const grow = on(t, 1);
  return (
    <svg viewBox="0 0 360 430" style={{ maxWidth: 440 }} role="img" aria-label="A treaty's two-way exchange beside a unilateral statement's single outward arrow">
      <g style={{ opacity: on(t, 0) }}>
        <text x="8" y="18" {...ui}>TREATY</text>
        <rect x="8" y="30" width="80" height="50" rx="8" {...box} />
        <text x="48" y="60" textAnchor="middle" {...ui}>A</text>
        <rect x="272" y="30" width="80" height="50" rx="8" {...box} />
        <text x="312" y="60" textAnchor="middle" {...ui}>B</text>
        <Arrow x1={92} x2={268} y={46} />
        <Arrow x1={268} x2={92} y={66} />
        <text x="180" y="104" textAnchor="middle" {...note}>at least two consenting parties</text>
      </g>
      <g style={{ opacity: Math.min(1, on(t, 0.8) * 5) }}>
        <text x="8" y="146" {...ui}>UNILATERAL STATEMENT</text>
        <rect x="8" y="158" width="80" height="50" rx="8" {...box} />
        <text x="48" y="188" textAnchor="middle" {...ui}>X</text>
        <g style={{ transform: `scaleX(${grow})`, transformOrigin: '92px 183px' }}>
          <Arrow x1={92} x2={268} y={183} />
        </g>
        <rect x="272" y="158" width="80" height="50" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="312" y="180" textAnchor="middle" {...note} fontSize="12">certain</text>
        <text x="312" y="196" textAnchor="middle" {...note} fontSize="12">other states</text>
        <text x="180" y="174" textAnchor="middle" {...note} fontSize="12" style={{ opacity: grow }}>public declaration</text>
        <text x="180" y="232" textAnchor="middle" {...note} style={{ opacity: grow }}>no return arrow: no offer, no acceptance,</text>
        <text x="180" y="250" textAnchor="middle" {...note} style={{ opacity: grow }}>no reciprocity; need not be in writing</text>
      </g>
      <g style={{ opacity: on(t, 2) }}>
        <text x="180" y="290" textAnchor="middle" {...note} fontStyle="italic" fill="var(--ink)">Eastern Greenland · Nuclear Tests</text>
        <text x="180" y="310" textAnchor="middle" {...note}>the declaration binds the declaring state</text>
      </g>
      <g style={{ opacity: on(t, 3) }}>
        <rect x="8" y="332" width="344" height="94" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="356" {...ui}>NOT A RESERVATION</text>
        <text x="22" y="378" {...note}>a reservation modifies an existing treaty</text>
        <text x="22" y="398" {...note}>relationship; a unilateral statement</text>
        <text x="22" y="416" {...note}>stands alone</text>
      </g>
    </svg>
  );
}

export default function UnilateralStatements() {
  return (
    <ScrollExplainer
      label="Unilateral statements contrasted with a treaty’s two-way exchange"
      terms={[
        { term: 'Unilateral statement', def: 'A public declaration by which a state accepts obligations, not dependent on reciprocal undertakings.' },
        { term: 'Reciprocity', def: 'Another state agreeing to do something in return — needed for a treaty, not for a unilateral statement.' },
        { term: 'Reservation', def: 'A treaty-specific statement, also made “unilaterally”, that modifies an existing treaty relationship.' },
      ]}
      beats={[
        { caption: 'A treaty needs at least two consenting parties: each undertakes something to the other.' },
        { caption: 'A unilateral statement is one state committing itself by public declaration: “not an offer or otherwise dependent on reciprocal undertakings from its addressees” (Crawford). It need not be in writing.' },
        { caption: 'Eastern Greenland and the Nuclear Tests Cases: a public declaration bound the declaring state internationally, with no other state’s acceptance needed.' },
        { caption: 'Do not confuse it with a reservation, also made “unilaterally”: a reservation modifies an existing treaty relationship; a unilateral statement stands alone.' },
      ]}
      scene={scene}
      check={{
        question: 'A foreign minister publicly promises that her state will stop a practice. No other state responds. Can it bind?',
        options: [
          { text: 'No — without another state’s acceptance there is no agreement', why: 'That is the treaty analysis; a unilateral statement needs no acceptance.' },
          { text: 'Yes — a public declaration showing a clear intention to be bound can bind the declaring state', correct: true, why: 'Eastern Greenland and Nuclear Tests: the declaration itself was a binding undertaking.' },
          { text: 'Only if it is a reservation to a treaty', why: 'A reservation modifies a treaty relationship; a unilateral statement stands alone.' },
        ],
      }}
    />
  );
}
