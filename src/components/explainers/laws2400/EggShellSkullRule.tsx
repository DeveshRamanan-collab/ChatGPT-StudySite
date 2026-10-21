/*
SCENE: The egg-shell skull rule (Topic 11 flowchart, Tort Law Principles 3e p 438; casebook extract of Tame)
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Show that one negligent act can cause very different harm to different plaintiffs, and that the defendant
  answers for the harm the actual plaintiff suffers — weaknesses, beliefs and reactions; capacities and attributes,
  physical, social and economic.
SUBJECT: Plaintiff B's harm bar, which grows beat by beat while Plaintiff A's stays put.
BEAT 1 (0–25%): the defendant's negligence (one minor knock) above two plaintiffs; both harm bars fill to "bruise".
  Bars grow with transform scaleX (scrubbed, ease none). Caption: same act, two plaintiffs.
BEAT 2 (25–50%): B's bar grows: a pre-existing weakness turns the bruise into a chronic condition; label
  "weaknesses, beliefs and reactions" fades in.
BEAT 3 (50–75%): B's bar grows again: lost earnings; label "capacities and attributes — physical, social, economic".
BEAT 4 (75–100%): a bracket spans all of B's bar: the defendant takes the plaintiff as found (Nader; Kavanagh v
  Akhtar); a footnote keeps the order — foreseeable kind first, then the rule governs extent (Tame).
CAMERA: none (2D SVG; wide and narrow layouts). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 8 KB gz. Only transform and opacity change.
Source: concept laws2400-w11-egg-shell-skull-rule; flowchart p 438 (Nader wording; see Kavanagh v Akhtar); casebook
  extract of Tame v New South Wales (Gummow and Kirby JJ, [199]–[203]). The two plaintiffs are an illustration, not
  the facts of any case.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const p = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ui = { fontFamily: 'var(--font-ui)' } as const;

function harmB(t: number) {
  return 0.25 * p(t, 0.2, 0.9) + 0.35 * p(t, 1.2, 1.8) + 0.4 * p(t, 2.2, 2.8);
}

function Bar({ x, y, w, k }: { x: number; y: number; w: number; k: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height="16" rx="4" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      {/* Grows by transform only: scale about the bar's left edge. */}
      <rect x={x} y={y} width={w} height="16" rx="4" fill="var(--ink)" opacity="0.8"
        transform={`translate(${x} 0) scale(${Math.max(0.001, k)} 1) translate(${-x} 0)`} />
    </>
  );
}

function wide(t: number) {
  const a = 0.25 * p(t, 0.2, 0.9);
  const b = harmB(t);
  return (
    <svg className="x-wide" viewBox="0 0 760 330" role="img" aria-label="One negligent act, two plaintiffs: Plaintiff A suffers a bruise; Plaintiff B's harm grows with a pre-existing weakness and higher earnings, and the defendant answers for all of it">
      <rect x="230" y="8" width="300" height="48" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="380" y="30" textAnchor="middle" {...ui} fontSize="14" fill="var(--ink)">Defendant’s negligence</text>
      <text x="380" y="47" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">the same minor knock</text>
      <g style={{ opacity: p(t, 0, 0.3) }}>
        <path d="M330 56 L165 88 M430 56 L550 88" stroke="var(--ink-3)" strokeWidth="1.5" fill="none" />
        <text x="165" y="106" textAnchor="middle" {...ui} fontSize="14" fill="var(--ink)">Plaintiff A</text>
        <text x="550" y="106" textAnchor="middle" {...ui} fontSize="14" fill="var(--ink)">Plaintiff B</text>
      </g>
      <Bar x={40} y={128} w={250} k={a} />
      <Bar x={400} y={128} w={300} k={b} />
      <text x="40" y="166" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 0.5, 0.9) }}>bruise</text>
      <text x="400" y="166" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 0.5, 0.9) }}>bruise</text>
      <text x="400" y="190" {...ui} fontSize="12.5" fill="var(--ink)" style={{ opacity: p(t, 1.1, 1.5) }}>+ chronic condition — a pre-existing weakness</text>
      <text x="400" y="208" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 1.1, 1.5) }}>weaknesses, beliefs and reactions</text>
      <text x="400" y="232" {...ui} fontSize="12.5" fill="var(--ink)" style={{ opacity: p(t, 2.1, 2.5) }}>+ lost earnings — a high-earning career</text>
      <text x="400" y="250" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 2.1, 2.5) }}>capacities and attributes: physical, social, economic</text>
      <g style={{ opacity: p(t, 3.1, 3.5) }}>
        <path d="M400 124 V117 H700 V124" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="550" y="276" textAnchor="middle" {...ui} fontSize="13.5" fill="var(--ink)">the defendant answers for all of it:</text>
        <text x="550" y="294" textAnchor="middle" {...ui} fontSize="13.5" fill="var(--ink)">plaintiff taken as found · Nader; Kavanagh v Akhtar</text>
        <text x="40" y="276" {...ui} fontSize="12" fill="var(--ink-2)">gate first: a foreseeable kind of harm;</text>
        <text x="40" y="294" {...ui} fontSize="12" fill="var(--ink-2)">then the rule governs extent (Tame)</text>
      </g>
    </svg>
  );
}

function tall(t: number) {
  const a = 0.25 * p(t, 0.2, 0.9);
  const b = harmB(t);
  return (
    <svg className="x-tall" viewBox="0 0 360 470" role="img" aria-label="One negligent act, two plaintiffs: Plaintiff A suffers a bruise; Plaintiff B's harm grows with a pre-existing weakness and higher earnings, and the defendant answers for all of it">
      <rect x="40" y="6" width="280" height="48" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="28" textAnchor="middle" {...ui} fontSize="14" fill="var(--ink)">Defendant’s negligence</text>
      <text x="180" y="45" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">the same minor knock</text>
      <g style={{ opacity: p(t, 0, 0.3) }}>
        <text x="16" y="86" {...ui} fontSize="14" fill="var(--ink)">Plaintiff A</text>
        <text x="16" y="160" {...ui} fontSize="14" fill="var(--ink)">Plaintiff B</text>
      </g>
      <Bar x={16} y={96} w={328} k={a} />
      <text x="16" y="130" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 0.5, 0.9) }}>bruise</text>
      <Bar x={16} y={180} w={328} k={b} />
      <text x="16" y="214" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 0.5, 0.9) }}>bruise</text>
      <text x="16" y="240" {...ui} fontSize="13" fill="var(--ink)" style={{ opacity: p(t, 1.1, 1.5) }}>+ chronic condition — a pre-existing weakness</text>
      <text x="16" y="258" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 1.1, 1.5) }}>weaknesses, beliefs and reactions</text>
      <text x="16" y="286" {...ui} fontSize="13" fill="var(--ink)" style={{ opacity: p(t, 2.1, 2.5) }}>+ lost earnings — a high-earning career</text>
      <text x="16" y="304" {...ui} fontSize="12" fill="var(--ink-2)" style={{ opacity: p(t, 2.1, 2.5) }}>capacities and attributes: physical, social, economic</text>
      <g style={{ opacity: p(t, 3.1, 3.5) }}>
        <path d="M16 177 V170 H344 V177" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="16" y="344" {...ui} fontSize="13.5" fill="var(--ink)">The defendant answers for all of it:</text>
        <text x="16" y="362" {...ui} fontSize="13.5" fill="var(--ink)">plaintiff taken as found</text>
        <text x="16" y="380" {...ui} fontSize="12" fill="var(--ink-2)">Nader; Kavanagh v Akhtar</text>
        <text x="16" y="414" {...ui} fontSize="12" fill="var(--ink-2)">Gate first: a foreseeable kind of harm;</text>
        <text x="16" y="432" {...ui} fontSize="12" fill="var(--ink-2)">then the rule governs extent (Tame).</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function EggShellSkullRule() {
  return (
    <ScrollExplainer
      label="The egg-shell skull rule: one negligent act, two plaintiffs"
      terms={[
        { term: 'Egg-shell skull rule', def: 'The defendant must take the plaintiff as found (Nader v Urban Transit Authority of NSW).' },
        { term: 'Weaknesses, beliefs and reactions', def: 'The plaintiff’s vulnerabilities, which do not reduce the defendant’s liability.' },
        { term: 'Capacities and attributes', def: 'What the plaintiff has and does — physical, social and economic — taken as found too.' },
        { term: 'Extent of harm', def: 'How much harm followed; it need not be reasonably foreseeable.' },
      ]}
      beats={[
        { caption: 'The same negligent act — a minor knock — reaches two plaintiffs. For Plaintiff A it causes a bruise.' },
        { caption: 'Plaintiff B has a pre-existing weakness, so the same knock leaves a chronic condition. The defendant takes the plaintiff with all his weaknesses, beliefs and reactions.' },
        { caption: 'Plaintiff B also earns far more, so the economic loss is larger. The rule reaches the plaintiff’s capacities and attributes — physical, social and economic.' },
        { caption: 'The defendant answers for all of B’s harm (Nader; Kavanagh v Akhtar). The gate is still a foreseeable kind of harm; once liability is established, the rule governs the damages (Tame).' },
      ]}
      scene={scene}
      check={{
        question: 'A negligent driver bruises a plaintiff whose undiagnosed condition turns the bruise into a long illness. Under the egg-shell skull rule?',
        options: [
          { text: 'Liable only for what an ordinary bruise would cause', why: 'The rule says the opposite: the defendant takes the plaintiff with all his weaknesses, not as an ordinary person.' },
          { text: 'Liable for the full harm: the plaintiff is taken as found', correct: true, why: 'Nader: the defendant must take the plaintiff with all his weaknesses, beliefs and reactions; the extent of harm need not be foreseeable.' },
          { text: 'Not liable for the extra harm, as the condition was unknown', why: 'The rule has no knowledge requirement: the plaintiff is taken as found, known weakness or not.' },
        ],
      }}
    />
  );
}
