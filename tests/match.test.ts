import { describe, it, expect } from 'vitest';
import { matchSentences, sentences, rubricScore } from '../src/lib/match';

const model =
  'The issue is whether the council breached its duty. Under s 5B(1) the risk must be foreseeable and not insignificant. ' +
  'Probability was high on a busy footpath, harm was moderate, and the burden of repair was low (s 5B(2)). ' +
  'Breach is therefore likely established.';

describe('sentences', () => {
  it('keeps section references inside a sentence', () => {
    expect(sentences(model)).toHaveLength(4);
    expect(sentences(model)[1]).toContain('s 5B(1)');
  });
});

describe('matchSentences', () => {
  it('points at the sentence that states the threshold', () => {
    expect(matchSentences(model, 'States the foreseeable and not insignificant threshold in s 5B(1)')).toContain(1);
  });
  it('points at the application sentence for the calculus criterion', () => {
    expect(matchSentences(model, 'Weighs probability, seriousness and the burden of precautions', { max: 1 })).toEqual([2]);
  });
  it('returns nothing for an unrelated criterion', () => {
    expect(matchSentences(model, 'Discusses remoteness of damage under Wagon Mound')).toEqual([]);
  });
});

describe('rubricScore', () => {
  it('sums ticked marks', () => {
    const rows = [{ id: 'a', marks: 2 }, { id: 'b', marks: 3 }, { id: 'c', marks: 5 }];
    expect(rubricScore(rows, ['a', 'c'])).toEqual({ got: 7, total: 10, score: 0.7 });
    expect(rubricScore(rows, []).score).toBe(0);
  });
});
