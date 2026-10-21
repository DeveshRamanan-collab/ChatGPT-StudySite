import { describe, it, expect } from 'vitest';
import { laneOf, yearOf, firstSentence } from '../src/lib/courts';

describe('laneOf', () => {
  it.each([
    ['(1983) 153 CLR 338', 'hca'],
    ['"[2020] HCA 19"', 'hca'],
    ['"[1932] AC 562"', 'uk-top'],
    ['(1999) UK House of Lords', 'uk-top'],
    ['"[2017] UKSC 5"', 'uk-top'],
    ['(Merits) [1986] ICJ Rep 14', 'icj'],
    ['(First Phase) (Advisory Opinion) [1950] ICJ Rep 65', 'icj'],
    ['Judgment, 1933, PCIJ, Series A/B, No. 53', 'icj'],
    ['(Judgement) IT-94-1-A (15 July 1999) (ICTY Appeals Chamber)', 'intl'],
    ['(Application No. 21987/93) (ECtHR, 20 March 2018)', 'intl'],
    ['(2023) 111 NSWLR 304', 'aus-other'],
    ['"[2010] NSWSC 1039"', 'aus-other'],
    ['"[1993] VR 153"', 'aus-other'],
    ['"[1897] 2 QB 57"', 'eng'],
    ['(1844) 174 ER 800', 'eng'],
    ['143 U.S. 457 (1892)', 'foreign'],
    ['(1963) German Federal Constitutional Court', 'foreign'],
    ['Not given in the course materials', 'unknown'],
    ['(1997)', 'unknown'],
  ])('%s → %s', (c, lane) => expect(laneOf(c)).toBe(lane));
});

describe('yearOf', () => {
  it('reads the first plausible year', () => {
    expect(yearOf('(1983) 153 CLR 338')).toBe(1983);
    expect(yearOf('143 U.S. 457 (1892)')).toBe(1892);
    expect(yearOf('Not given in the materials')).toBeNull();
  });
});

describe('firstSentence', () => {
  it('stops at the first full stop or semicolon', () => expect(firstSentence('A duty is owed. Then more.')).toBe('A duty is owed.'));
});
