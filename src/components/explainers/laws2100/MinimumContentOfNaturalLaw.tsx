/*
SCENE: Hart's minimum content of natural law — truisms feed three protections shared by law and morality
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Simple truisms about human beings make protections for persons, property and promises indispensable to both
  positive law and social morality — a natural necessity, not a conceptual connection.
SUBJECT: the three protections, rising from the truisms into both boxes.
BEAT 1 (0–25%): the truisms (vulnerability, the need for protection) fade in. BEAT 2 (25–50%): three pillars rise
  (translateY, scrubbed, ease none): persons, property, promises. BEAT 3 (50–75%): two boxes — positive law and social
  morality — both hold the pillars. BEAT 4 (75–100%): stamp "natural necessity, not conceptual".
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w04-minimum-content-of-natural-law; authority hart-the-concept-of-law.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const PILLARS = [{ x: 60, t: 'persons' }, { x: 180, t: 'property' }, { x: 300, t: 'promises' }];

function scene(t: number) {
  const on = (i: number) => clamp((t - i) * 2 + 0.3);
  const rise = 40 * (1 - clamp(t - 1));
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="Truisms about human beings feed protections for persons, property and promises, shared by positive law and social morality">
      <g opacity={on(0)}>
        <rect x="8" y="8" width={W - 16} height="64" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="22" y="30" {...head} fill="var(--ink-2)">SIMPLE TRUISMS</text>
        <text x="22" y="56" {...body} fontSize={13} fill="var(--ink)">human vulnerability; the need for protection</text>
      </g>
      <g opacity={on(1)} transform={`translate(0 ${rise})`}>
        {PILLARS.map((p) => (
          <g key={p.t}>
            <line x1={p.x} y1="76" x2={p.x} y2="100" stroke="var(--ink-3)" strokeWidth="1.5" />
            <rect x={p.x - 50} y="100" width="100" height="56" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <text x={p.x} y="133" textAnchor="middle" {...body} fill="var(--ink)">{p.t}</text>
          </g>
        ))}
      </g>
      <g opacity={on(2)}>
        {PILLARS.flatMap((p) => [90, 270].map((x) => <line key={`${p.x}-${x}`} x1={p.x} y1="156" x2={x} y2="196" stroke="var(--ink-3)" strokeWidth="1" />))}
        <rect x="8" y="196" width="164" height="48" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="90" y="225" textAnchor="middle" {...head} fontSize={11}>POSITIVE LAW</text>
        <rect x="188" y="196" width="164" height="48" rx="10" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="270" y="225" textAnchor="middle" {...head} fontSize={11}>SOCIAL MORALITY</text>
        <text x={W / 2} y="280" textAnchor="middle" {...body}>even a cruel dictatorship must protect</text>
        <text x={W / 2} y="300" textAnchor="middle" {...body}>those who accept its rules</text>
      </g>
      <g opacity={on(3)}>
        <rect x="8" y="330" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={W / 2} y="360" textAnchor="middle" {...head}>NATURAL NECESSITY</text>
        <text x={W / 2} y="386" textAnchor="middle" {...body}>not a conceptual connection</text>
        <text x={W / 2} y="410" textAnchor="middle" {...body} fontSize={12}>reply to "law may have any content"</text>
      </g>
    </svg>
  );
}

export default function MinimumContentOfNaturalLaw() {
  return (
    <ScrollExplainer
      label="Hart's minimum content of natural law: truisms, three protections, natural necessity"
      terms={[
        { term: 'Minimum content', def: 'Rules restricting violence and requiring respect for property and promises.' },
        { term: 'Natural necessity', def: 'Necessary given the world we live in — not necessary by the concept of law.' },
        { term: '"Law may have any content"', def: "The positivist thesis Hart replies to: Kelsen's, for whom only the chain of validity matters." },
      ]}
      beats={[
        { caption: 'Simple truisms about human beings "disclose the core of good sense in the doctrine of Natural Law" — an empirical version drawn from Hobbes (Leviathan chs 14–15) and Hume (Treatise III.2).' },
        { caption: 'Given these natural facts and aims, minimum forms of protection for persons, property and promises are "similarly indispensable features of municipal law" (CL 199).' },
        { caption: 'They underlie both positive law and social morality. Even the most cruel dictatorship needs some members to accept its rules; unless the rules protect at least them, it would be a suicide pact.' },
        { caption: 'This is a natural necessity, not a conceptual connection between law and morality — just as coercion is not, for Hart, a necessary feature of law. Finnis: call it the minimum content of positive law.' },
      ]}
      scene={scene}
      check={{
        question: 'Does the minimum content of natural law mean Hart accepts a necessary connection between law and morality?',
        options: [
          { text: 'Yes — every legal system must be morally just', why: 'Hart claims only minimal protections, and even a cruel dictatorship can provide them for its supporters.' },
          { text: 'No — the link is a natural necessity in the world we live in, not a conceptual one', correct: true, why: 'Hart concedes a grain of truth to natural law without conceding the NCLM.' },
          { text: "No — Hart agrees with Kelsen that law may have any content", why: "Hart offers the minimum content precisely as a reply to that thesis (CL 199)." },
        ],
      }}
    />
  );
}
