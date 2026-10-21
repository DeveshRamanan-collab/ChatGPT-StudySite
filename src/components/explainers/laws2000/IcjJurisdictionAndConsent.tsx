/*
SCENE: ICJ jurisdiction — access, four ways to consent, and a dispute at filing
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the parties and the consent switches → watch the three stages → one check
INTENT: The ICJ has no compulsory jurisdiction: a case runs only if both parties are states (access), at least one
  art 36 route supplies consent, and a dispute existed when proceedings began.
SUBJECT: the three stacked stages (access → consent → dispute); the first that fails turns clay and names the gap.
BEAT 1 (0–100%): selects and toggles; the consent rows show which route carries the case, the verdict updates within
  200ms. Colour transitions only (180ms ease-out).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w08-icj-jurisdiction-and-consent; ICJ Statute arts 34, 36, 36(2), 36(6), 65–68 (Week 8
slides 31–32); art IX Genocide Convention (Week 8 tutorial tasks).
*/
import type { ReactNode } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';

type Party = 'state' | 'org' | 'ngo';

interface S extends Record<string, unknown> {
  applicant: Party;
  respondent: Party;
  compromis: boolean;
  treaty: boolean;
  optional: 'none' | 'applicant' | 'both';
  prorogatum: boolean;
  dispute: boolean;
}

const initial: S = { applicant: 'state', respondent: 'state', compromis: false, treaty: true, optional: 'none', prorogatum: false, dispute: true };

const PARTY: Record<Party, string> = { state: 'A state', org: 'An international organisation (e.g. the UN)', ngo: 'An NGO or individual' };

type RowState = 'pass' | 'stop' | 'idle';
const TONE: Record<RowState, { c: string; mark: string }> = {
  pass: { c: 'var(--sage)', mark: '●' },
  stop: { c: 'var(--clay)', mark: '✕' },
  idle: { c: 'var(--ink-3)', mark: '○' },
};

function Stage({ n, title, state, children }: { n: number; title: string; state: RowState; children: ReactNode }) {
  const t = TONE[state];
  return (
    <li style={{ padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', border: `1.5px solid ${t.c}`, transition: 'border-color 180ms var(--ease-out)' }}>
      <p style={{ margin: 0, display: 'flex', gap: 'var(--s-2)', alignItems: 'baseline', fontSize: 'var(--t-sm)', color: state === 'idle' ? 'var(--ink-2)' : 'var(--ink)' }}>
        <span aria-hidden="true" className="mono" style={{ color: t.c }}>{t.mark}</span>
        <span className="mono" style={{ color: 'var(--ink-2)' }}>{n}</span>
        <span>{title}</span>
        <span className="label" style={{ marginLeft: 'auto', color: 'var(--ink-2)' }}>{state === 'pass' ? 'met' : state === 'stop' ? 'fails' : 'not reached'}</span>
      </p>
      <div style={{ marginTop: 'var(--s-1)', fontSize: 'var(--t-xs)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{children}</div>
    </li>
  );
}

function routes(s: S) {
  return [
    { id: 'compromis', label: 'Compromis — special agreement for this dispute', on: s.compromis },
    { id: 'treaty', label: 'Treaty clause covering this dispute (e.g. art IX Genocide Convention)', on: s.treaty },
    { id: 'optional', label: 'Optional clause — art 36(2) declarations by both states', on: s.optional === 'both' },
    { id: 'prorogatum', label: 'Forum prorogatum — respondent consents after filing', on: s.prorogatum },
  ];
}

function view(s: S): SimView {
  const access = s.applicant === 'state' && s.respondent === 'state';
  const rs = routes(s);
  const carrying = rs.filter((r) => r.on);
  const consent = carrying.length > 0;
  const st = (ok: boolean, reached: boolean): RowState => (!reached ? 'idle' : ok ? 'pass' : 'stop');
  const figure = (
    <div className="xgates" role="group" aria-label="Three stages of ICJ jurisdiction: access, consent, a dispute at filing">
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        <Stage n={1} title="Access — only states may be parties (art 34)" state={st(access, true)}>
          Applicant: {PARTY[s.applicant].toLowerCase()} · Respondent: {PARTY[s.respondent].toLowerCase()}
        </Stage>
        <Stage n={2} title="Consent — at least one route in art 36" state={st(consent, access)}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '2px' }}>
            {rs.map((r) => <li key={r.id} style={{ color: r.on ? 'var(--ink)' : 'var(--ink-2)' }}>{r.on ? '● ' : '○ '}{r.label}</li>)}
          </ul>
          {s.optional === 'applicant' && <p style={{ margin: 'var(--s-1) 0 0' }}>Only the applicant has declared: the optional clause works only between states accepting the same obligation.</p>}
        </Stage>
        <Stage n={3} title="A dispute existed when proceedings were instituted" state={st(s.dispute, access && consent)}>
          Opposed views the respondent knew of, before filing.
        </Stage>
      </ol>
      <p className="xgates__end" data-state={access && consent && s.dispute ? 'pass' : 'stop'}>{access && consent && s.dispute ? 'jurisdiction → the Court decides any doubt itself (art 36(6))' : 'no jurisdiction'}</p>
    </div>
  );
  const nonState = s.applicant !== 'state' ? s.applicant : s.respondent;
  const verdict = !access
    ? nonState === 'org'
      ? 'No access: international organisations, including the UN, cannot be parties (art 34) — but they can seek an advisory opinion (arts 65–68).'
      : 'No access: non-state entities cannot bring or defend a contentious case; only sovereign states may be parties (art 34).'
    : !consent
      ? 'No jurisdiction: the ICJ has no compulsory jurisdiction, and no compromis, treaty clause, reciprocal declaration or later consent is present.'
      : !s.dispute
        ? 'Consent is there, but no dispute existed at filing — so there is still no jurisdiction.'
        : `Jurisdiction via ${carrying.map((r) => r.id === 'compromis' ? 'a compromis' : r.id === 'treaty' ? 'a treaty clause' : r.id === 'optional' ? 'the optional clause' : 'forum prorogatum').join(' and ')}. Any disagreement about it is for the Court (art 36(6)).`;
  return { figure, verdict, tone: access && consent && s.dispute ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.applicant !== b.applicant || a.respondent !== b.respondent) {
    const p = a.applicant !== b.applicant ? b.applicant : b.respondent;
    return p === 'state' ? 'A sovereign state: it may be a party in a contentious case.' : p === 'org' ? 'An international organisation cannot be a party; it may only request an advisory opinion.' : 'A non-state entity cannot bring a case to the Court (art 34).';
  }
  if (a.compromis !== b.compromis) return b.compromis ? 'A compromis: both agree to submit this particular dispute.' : 'No special agreement for this dispute.';
  if (a.treaty !== b.treaty) return b.treaty ? 'Both are parties to a treaty whose clause sends this kind of dispute to the Court.' : 'No treaty clause covers this dispute.';
  if (a.optional !== b.optional) return b.optional === 'both' ? 'Both have made art 36(2) declarations: each accepts the same obligation.' : b.optional === 'applicant' ? 'Only the applicant has declared — not enough on its own.' : 'No optional-clause declarations.';
  if (a.prorogatum !== b.prorogatum) return b.prorogatum ? 'The respondent consents after the application was filed: forum prorogatum.' : 'The respondent has not consented since filing.';
  if (a.dispute !== b.dispute) return b.dispute ? 'A dispute existed at the date of filing.' : 'No dispute at filing: even with consent there is no jurisdiction.';
  return '';
}

export default function IcjJurisdictionAndConsent() {
  return (
    <Simulation<S>
      label="ICJ jurisdiction: access, then consent under art 36, then a dispute at filing"
      terms={[
        { term: 'Compulsory jurisdiction', def: 'What the ICJ does not have: no state can be taken to the Court without its consent.' },
        { term: 'Compromis', def: 'A special agreement submitting one particular dispute to the Court.' },
        { term: 'Optional clause', def: 'An art 36(2) declaration accepting jurisdiction against states accepting the same obligation.' },
        { term: 'Forum prorogatum', def: 'Consent given by a respondent after the application has been filed.' },
      ]}
      initial={initial}
      controls={[
        { key: 'applicant', label: 'Applicant', type: 'select', options: (Object.keys(PARTY) as Party[]).map((k) => ({ value: k, label: PARTY[k] })) },
        { key: 'respondent', label: 'Respondent', type: 'select', options: (Object.keys(PARTY) as Party[]).map((k) => ({ value: k, label: PARTY[k] })) },
        { key: 'compromis', label: 'Compromis for this dispute', type: 'toggle' },
        { key: 'treaty', label: 'Treaty clause covering this dispute', type: 'toggle' },
        { key: 'optional', label: 'Art 36(2) declarations', type: 'select', options: [{ value: 'none', label: 'Neither state' }, { value: 'applicant', label: 'Applicant only' }, { value: 'both', label: 'Both states' }] },
        { key: 'prorogatum', label: 'Respondent consents after filing', type: 'toggle' },
        { key: 'dispute', label: 'A dispute existed at filing', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State K has made an art 36(2) declaration; State L has made none and has no other link to the Court. K sues L. Jurisdiction?',
        options: [
          { text: 'Yes — K’s declaration accepts jurisdiction over all future legal disputes', why: 'A declaration operates only against states accepting the same obligation; L has accepted nothing.' },
          { text: 'No — unless L consents some other way, such as later consent (forum prorogatum)', correct: true, why: 'The optional clause works only between declarants; without a compromis, treaty clause or later consent from L, there is no basis of jurisdiction.' },
          { text: 'Yes — the Court can establish its own jurisdiction under art 36(6)', why: 'Art 36(6) lets the Court decide whether consent exists; it cannot create consent that is absent.' },
        ],
      }}
    />
  );
}
