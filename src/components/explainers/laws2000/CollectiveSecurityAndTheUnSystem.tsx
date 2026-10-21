/*
SCENE: Collective security — every state's claim to use force drawn in to one centre, the Security Council
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 war against one is war against all · 2 force centralised in the Council · 3 three tools leave it ·
  4 the limits (no standing army; capacity and the veto)
INTENT: Show that collective security turns aggression from a private dispute into everyone's concern, and that the
  UN does this by centralising the permissible use of force in the Security Council, which then has three tools.
SUBJECT: the Security Council box; the five state nodes feed into it, and the three tools leave it.
BEAT 1 (0–25%): five state nodes and the principle draw on. BEAT 2 (25–50%): converging lines and the Council box.
  BEAT 3 (50–75%): the spine and three tool boxes (Chapter VI art 33; Chapter VII art 41; Chapter VII art 42).
  BEAT 4 (75–100%): a dashed limits box. Scrubbed, ease: none (base).
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 8 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible on phones.
Source: concept laws2000-w10-collective-security-and-the-un-system; Week 10 slides 4, 5, 7, 11, 44; UN Charter art 1(1).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const STATES = [44, 112, 180, 248, 316];

function Box({ y, h, title, lines, id, dashed }: { y: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="40" y={y} width={W - 48} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      <text x={196} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={196} y={y + 50 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 690`} role="img" aria-label="Five states feed into the Security Council, which has three tools: peaceful settlement under art 33, measures without force under art 41, and force under art 42; a dashed box notes its limits">
    <g data-step="1">
      <text x={W / 2} y="24" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="principle">WAR AGAINST ONE IS WAR AGAINST ALL</text>
      <text x={W / 2} y="48" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">aggression concerns every state —</text>
      <text x={W / 2} y="68" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">not a private dispute between two</text>
      {STATES.map((x) => <circle key={x} cx={x} cy="104" r="14" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
      <text x={W / 2} y="142" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-3)">League of Nations · United Nations · NATO</text>
    </g>
    <g data-step="2">
      {STATES.map((x) => <line key={x} x1={x} y1="118" x2={W / 2 + (x - W / 2) * 0.25} y2="186" stroke="var(--ink-3)" strokeWidth="1.2" />)}
      <rect x="40" y="186" width={W - 48} height="88" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={196} y="214" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="14" letterSpacing="1.5" fill="var(--ink)" data-label="council">SECURITY COUNCIL</text>
      <text x={196} y="240" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">the one body for the</text>
      <text x={196} y="260" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">permissible use of force</text>
    </g>
    <g data-step="3">
      <line x1="24" y1="230" x2="24" y2="540" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="24" y1="230" x2="40" y2="230" stroke="var(--ink-3)" strokeWidth="1.5" />
      {[340, 430, 520].map((y) => <line key={y} x1="24" y1={y} x2="40" y2={y} stroke="var(--ink-3)" strokeWidth="1.5" />)}
      <Box id="art-33" y={300} h={80} title="PEACEFUL SETTLEMENT" lines={['Chapter VI · art 33', 'mediation · ICJ · PCA']} />
      <Box id="art-41" y={390} h={80} title="COLLECTIVE SECURITY — NO FORCE" lines={['Chapter VII · art 41', 'sanctions']} />
      <Box id="art-42" y={480} h={80} title="COLLECTIVE SECURITY — FORCE" lines={['Chapter VII · art 42', 'authorise states, regional bodies']} />
    </g>
    <g data-step="4">
      <Box id="limits" dashed y={590} h={92} title="LIMITS" lines={['no standing UN army: relies on members', 'not every case: capacity · the P-5 veto']} />
    </g>
  </svg>
);

export default function CollectiveSecurityAndTheUnSystem() {
  return (
    <Diagram
      label="Collective security: force centralised in the Security Council, with three tools"
      terms={[
        { term: 'Collective security', def: 'A system where war and aggression are the concern of all states: war against one is war against all.' },
        { term: 'Security Council', def: 'The one UN body in which the permissible use of force is centralised.' },
        { term: 'Chapter VI / Chapter VII', def: 'The Charter chapters for peaceful settlement, and for threats to the peace, breaches and aggression.' },
        { term: 'P-5', def: 'The five permanent members, each holding a veto.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Collective security makes war and aggression the concern of all states, not a private dispute between them: war against one is war against all. The League of Nations and the UN were both founded on it; NATO is another example.' },
        { caption: 'The UN system centralises the permissible use of force in one body — the Security Council — which decides how to maintain or restore international peace and security.' },
        { caption: 'Its tools run from peaceful settlement (Chapter VI, art 33) to collective security without force (art 41: sanctions) and with force (art 42: authorising member states, regional organisations or peacekeeping operations).' },
        { caption: 'With no standing UN army it relies on member states, and it has not been able to act in every case — because of a lack of capacity, but also the P-5 veto.' },
      ]}
      check={{
        question: 'State A invades State B. Under the UN collective security system, who decides on the collective response?',
        options: [
          { text: 'Any state — war against one is war against all', why: 'The slogan explains why aggression concerns everyone, but the system centralises decisions about force rather than leaving each state to act.' },
          { text: 'The Security Council, where the permissible use of force is centralised', correct: true, why: 'When there is a threat to peace, breach of peace or act of aggression, it is for the Security Council to decide measures to maintain or restore peace.' },
          { text: 'The General Assembly, where all 193 members vote', why: 'The Assembly has a subsidiary responsibility and a minimal role in enforcement; it recommends rather than decides.' },
        ],
      }}
    />
  );
}
