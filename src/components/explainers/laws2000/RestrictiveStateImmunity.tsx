/*
SCENE: Restrictive immunity — acta jure imperii and jure gestionis
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the transaction → watch the marker on the sovereign ↔ commercial spectrum and the lamp → one check
INTENT: Show that under the restrictive approach the nature of the act decides (purpose only if the parties agreed),
  that art 10's commercial exception has its own carve-outs, and that art 12 removes immunity for local torts.
SUBJECT: the marker on the spectrum; its side decides the lamp (immune / not immune).
BEAT 1 (0–100%): selects and toggles move the marker (transform only, 240ms ease-in-out, full motion only); the lamp
  and verdict update within 200ms, citing Trendex, Playa Largo, art 10, art 2(2) or art 12.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — the marker jumps to its final position; verdict identical.
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w06-restrictive-state-immunity; UNCSI 2004 arts 2(1)(c), 2(2), 10, 11, 12 authority cards;
  Empire of Iran, Trendex, Playa Largo.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  approach: 'restrictive' | 'absolute';
  nature: 'sovereign' | 'commercial' | 'employment';
  purpose: 'sovereign' | 'commercial';
  purposeAgreed: boolean;
  counterparty: 'private' | 'state';
  expressAgreement: boolean;
  tort: boolean;
}

const initial: S = { approach: 'restrictive', nature: 'commercial', purpose: 'sovereign', purposeAgreed: false, counterparty: 'private', expressAgreement: false, tort: false };

type Out = { pos: number; immune: boolean | null; verdict: string };

function decide(s: S): Out {
  if (s.approach === 'absolute') return { pos: 0.5, immune: true, verdict: 'Immune: on the absolute approach the nature of the act does not matter. About one-third of states, including China, reject the distinction.' };
  if (s.tort) return { pos: 0.5, immune: false, verdict: 'Not immune (art 12): compensation for death, injury or damage to tangible property, caused by an act attributable to the state, in the forum state, with its author present.' };
  if (s.nature === 'sovereign') return { pos: 0.12, immune: true, verdict: 'Immune: an act jure imperii — foreign or military affairs, legislation, police power, the administration of justice.' };
  if (s.nature === 'employment') return { pos: 0.5, immune: null, verdict: 'Not a “commercial transaction” (art 2(1)(c) excludes employment contracts): test it under art 11 instead.' };
  const purposeCounts = s.purposeAgreed && s.purpose === 'sovereign';
  if (purposeCounts) return { pos: 0.4, immune: null, verdict: 'The parties agreed purpose counts (art 2(2)), so the sovereign purpose must be weighed alongside the commercial nature.' };
  if (s.counterparty === 'state') return { pos: 0.72, immune: true, verdict: 'Commercial, but art 10 does not apply to commercial transactions between states: immunity can still be invoked.' };
  if (s.expressAgreement) return { pos: 0.72, immune: true, verdict: 'Commercial, but the parties expressly agreed otherwise: art 10’s exception does not bite.' };
  return {
    pos: 0.88,
    immune: false,
    verdict: s.purpose === 'sovereign'
      ? 'Not immune: nature decides, not purpose (art 2(2)) — Cuba’s foreign-policy reasons in Playa Largo did not make the sugar deal sovereign.'
      : 'Not immune (art 10): a commercial transaction with a private person — like the unpaid letter of credit in Trendex.',
  };
}

function Spectrum({ pos, immune }: { pos: number; immune: boolean | null }) {
  const { motion } = useExplainer();
  const tr = motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none';
  const lamp = immune === null ? 'var(--paper-3)' : immune ? 'var(--sage)' : 'var(--clay)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)', color: 'var(--ink-2)', marginBottom: 'var(--s-2)' }}>
        <span>jure imperii · sovereign</span><span>jure gestionis · commercial</span>
      </div>
      <div style={{ position: 'relative', height: '28px' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '12px', height: '4px', borderRadius: 'var(--r-pill)', background: 'var(--paper-3)' }} />
        <div style={{ position: 'absolute', left: '50%', top: '4px', width: '1px', height: '20px', background: 'var(--ink-3)' }} />
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${pos * 100}%)`, transition: tr }}>
          <span style={{ position: 'absolute', left: '-9px', top: '5px', width: '18px', height: '18px', borderRadius: 'var(--r-pill)', background: 'var(--ink)' }} />
        </div>
      </div>
      <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', margin: 'var(--s-4) 0 0', fontWeight: 600 }}>
        <span aria-hidden="true" style={{ width: '16px', height: '16px', borderRadius: 'var(--r-pill)', background: lamp, border: '1.5px solid var(--ink-3)', transition: 'background-color 180ms var(--ease-out)' }} />
        {immune === null ? 'Open: characterise further' : immune ? 'Immune' : 'Not immune'}
      </p>
    </div>
  );
}

function view(s: S): SimView {
  const o = decide(s);
  return {
    figure: <div className="xgates" role="group" aria-label="The act on a spectrum from sovereign to commercial, with an immunity lamp"><Spectrum pos={o.pos} immune={o.immune} /></div>,
    verdict: o.verdict,
    tone: o.immune === null ? 'open' : o.immune ? 'yes' : 'no',
  };
}

function describe(a: S, b: S) {
  if (a.approach !== b.approach) return b.approach === 'absolute' ? 'Absolute approach: the state is immune whatever it did.' : 'Restrictive approach: most states today; absolute immunity is no longer custom (Empire of Iran).';
  if (a.nature !== b.nature) return b.nature === 'sovereign' ? 'A sovereign act: the marker moves to jure imperii.' : b.nature === 'commercial' ? 'Goods, services, loans or other commercial dealings: jure gestionis. Profit is irrelevant.' : 'An employment contract: outside art 2(1)(c); art 11 deals with it.';
  if (a.purpose !== b.purpose) return b.purpose === 'sovereign' ? 'A sovereign purpose — like buying embassy supplies. It matters only if the parties agreed it should.' : 'A commercial purpose.';
  if (a.purposeAgreed !== b.purposeAgreed) return b.purposeAgreed ? 'The parties agreed purpose should be taken into account (art 2(2)).' : 'No agreement on purpose: look at the nature of the transaction alone.';
  if (a.counterparty !== b.counterparty) return b.counterparty === 'state' ? 'The counterparty is another state: art 10 excludes transactions between states.' : 'The counterparty is a foreign natural or juridical person: art 10 can apply.';
  if (a.expressAgreement !== b.expressAgreement) return b.expressAgreement ? 'The parties expressly agreed otherwise: an art 10 exception.' : 'No express agreement displacing art 10.';
  if (a.tort !== b.tort) return b.tort ? 'The claim is for death, injury or property damage in the forum, author present: art 12.' : 'Not a local tort claim: art 12 falls away.';
  return '';
}

export default function RestrictiveStateImmunity() {
  return (
    <Simulation<S>
      label="Restrictive state immunity: the nature of the act on a sovereign to commercial spectrum"
      terms={[
        { term: 'Acta jure imperii', def: 'Sovereign acts — foreign and military affairs, legislation, police, justice. Immune.' },
        { term: 'Acta jure gestionis', def: 'Non-sovereign, commercial acts. Not immune under the restrictive approach.' },
        { term: 'Commercial transaction', def: 'Goods, services, loans or other commercial dealings, not employment contracts (art 2(1)(c)).' },
        { term: 'Nature, not purpose', def: 'Art 2(2): characterise by nature; weigh purpose only if the parties agreed.' },
      ]}
      initial={initial}
      controls={[
        { key: 'approach', label: 'Forum state’s approach', type: 'select', options: [{ value: 'restrictive', label: 'Restrictive' }, { value: 'absolute', label: 'Absolute' }] },
        { key: 'nature', label: 'Nature of the act', type: 'select', options: [{ value: 'sovereign', label: 'Sovereign (military, legislation, police)' }, { value: 'commercial', label: 'Commercial (goods, services, loans)' }, { value: 'employment', label: 'Employment contract' }] },
        { key: 'purpose', label: 'Purpose of the act', type: 'select', options: [{ value: 'sovereign', label: 'Sovereign purpose' }, { value: 'commercial', label: 'Commercial purpose' }] },
        { key: 'purposeAgreed', label: 'Parties agreed purpose should count', type: 'toggle' },
        { key: 'counterparty', label: 'Other party', type: 'select', options: [{ value: 'private', label: 'Private person or company' }, { value: 'state', label: 'Another state' }] },
        { key: 'expressAgreement', label: 'Parties expressly agreed otherwise', type: 'toggle' },
        { key: 'tort', label: 'Claim for death, injury or property damage in the forum, author present', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A foreign state buys office supplies for its embassy from a local company, then refuses to pay. Is it immune?',
        options: [
          { text: 'Yes — the purpose, running an embassy, is sovereign', why: 'Purpose counts only if the parties agreed (art 2(2)); on its own it cannot make the deal sovereign.' },
          { text: 'No — buying goods is commercial in nature, whatever its purpose', correct: true, why: 'The nature of the transaction decides: a purchase of goods from a private company is jure gestionis, so art 10 removes immunity.' },
          { text: 'Yes — only profit-making transactions are commercial', why: 'Profit is irrelevant to whether a transaction is commercial under art 2(1)(c).' },
        ],
      }}
    />
  );
}
