// Court and year from a case's citation string, for the case explorer's timeline and hierarchy lanes.
// Pure and conservative: anything it cannot place goes to the "unknown" lane rather than a guess.

export type Lane = 'icj' | 'intl' | 'hca' | 'uk-top' | 'aus-app' | 'aus-other' | 'eng' | 'foreign' | 'unknown';

/** Lanes in display order: international first, then the Australian hierarchy from the top, then other systems. */
export const LANES: { id: Lane; label: string; short: string }[] = [
  { id: 'icj', label: 'International Court of Justice / Permanent Court', short: 'ICJ / PCIJ' },
  { id: 'intl', label: 'Other international courts and tribunals', short: 'Intl tribunals' },
  { id: 'hca', label: 'High Court of Australia', short: 'High Court' },
  { id: 'uk-top', label: 'UK final courts (House of Lords, Privy Council, UK Supreme Court)', short: 'UK final' },
  { id: 'aus-app', label: 'Australian intermediate appeal courts', short: 'Aus appeal' },
  { id: 'aus-other', label: 'Other Australian courts and reports', short: 'Aus other' },
  { id: 'eng', label: 'English courts below the final court', short: 'English' },
  { id: 'foreign', label: 'Other domestic courts', short: 'Other domestic' },
  { id: 'unknown', label: 'Court not given in the materials', short: 'Not given' },
];

const RULES: [RegExp, Lane][] = [
  [/\bP\.?C\.?I\.?J\b|\bICJ\b|I\.C\.J|Advisory Opinion/i, 'icj'],
  [/\bICTY\b|\bICTR\b|ECtHR|\bECHR\b|\bILR\b|Tribunal|Arbitra|\bRIAA\b|\bITLOS\b|\bWTO\b|Appeals Chamber/i, 'intl'],
  [/\bHCA\b|\d+\s+C\.?L\.?R\b|\d+\s+CR\s+\d/i, 'hca'],
  [/\bUKHL\b|\bUKSC\b|\bUKPC\b|House of Lords|Privy Council|\bA\.?C\.?\s+\d/i, 'uk-top'],
  [/\bNSWCA\b|\bVSCA\b|\bQCA\b|\bWASCA\b|\bSASCFC\b|\bFCAFC\b|Court of Appeal \(NSW\)/i, 'aus-app'],
  [/\bNSWLR\b|\bNSWSC\b|\bV\.?L?\.?R\b|\bQd\s?R\b|\bWAR\b|\bSASR\b|\bFCR\b|\bFCA\b|\bFLR\b|\bMVR\b|\bALR\b|\bTasR\b|\bACTR\b|\bNTR\b|\bSR \(NSW\)/i, 'aus-other'],
  [/\bQB\b|\bKB\b|\bCh\b|\bER\b|\bEWCA\b|\bEWHC\b|English Court|\bWLR\b|All ER|\bExch\b|\bCP\b/i, 'eng'],
  [/\bU\.?S\.?\s+\d|\d+\s+U\.?S\.?\b|\bF\.?\s?\dd\b|\bNY\b|\bSCR\b|German|Netherlands|Federal Constitutional|Supreme Court of/i, 'foreign'],
];

export function laneOf(citation: string): Lane {
  const c = citation ?? '';
  if (!c.trim() || /not given|citation not|not in the/i.test(c)) return 'unknown';
  for (const [re, lane] of RULES) if (re.test(c)) return lane;
  return 'unknown';
}

/** The decision year: the first plausible year in the citation (1500–2039), else null. */
export function yearOf(citation: string): number | null {
  const m = (citation ?? '').match(/\b(1[5-9]\d\d|20[0-3]\d)\b/);
  return m ? Number(m[1]) : null;
}

/** First sentence of a field, for one-line summaries. */
export const firstSentence = (t: string) => (t || '').replace(/\s+/g, ' ').trim().match(/^.*?[.;](\s|$)/)?.[0]?.trim() ?? (t || '').trim();
