import {describe,it,expect} from 'vitest';
import {normaliseSourceSearch,sourceMatchesQuery} from '../src/lib/source-search';
describe('source reference search',()=>{
 it('matches citation punctuation without dropping section numbers',()=>{
  expect(sourceMatchesQuery('Civil Liability Act 2002 (NSW)\n5B General principles','Civil Liability Act — Civil Liability Act 2002 (NSW) s 5B')).toBe(true);
  expect(sourceMatchesQuery('Civil Liability Act 2002 (NSW)\n5D Causation','Civil Liability Act 2002 (NSW) s 5B')).toBe(false);
 });
 it('normalises quotation typography and case punctuation for search only',()=>{
  const text="O’Brien v. Smith [2005] HCA 32";
  expect(sourceMatchesQuery(text,"O'Brien v Smith (2005) HCA 32")).toBe(true);
  expect(normaliseSourceSearch('ss 5B–5D')).toBe('5b 5d');
  expect(text).toBe("O’Brien v. Smith [2005] HCA 32");
 });
});
