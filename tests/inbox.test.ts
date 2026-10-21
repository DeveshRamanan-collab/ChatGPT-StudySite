// New material → raw/ names (scripts/inbox.mjs): each unit's convention, tag and "for Code" dropped.
import { describe, it, expect } from 'vitest';
import { rawName } from '../scripts/inbox.mjs';

const T = ' [NOT YET IN STUDY SITE]';
describe('inbox: raw/ file names', () => {
  it('Torts: Topic N naming; slides lose "Slides"; transcripts keep their title', () => {
    expect(rawName('Torts', `Torts - Week 09 - Lecture 1 Slides${T}.pptx`)).toBe('Topic 9 Lecture 1.pptx');
    expect(rawName('Torts', `Torts - Week 10 - Lecture 2 Transcript for Code - Causation${T}.txt`)).toBe('Topic 10 Lecture 2 Transcript - Causation.txt');
    expect(rawName('Torts', `Torts - Week 12 - Flowcharts - Defences (Tort Law Principles 3e, pp 478-479)${T}.pdf`)).toBe('Topic 12 Flowcharts - Defences (Tort Law Principles 3e, pp 478-479).pdf');
  });
  it('International and Jurisprudence drop the unit prefix', () => {
    expect(rawName('International', `International - Week 10 - Lecture Transcript for Code (Live) - Collective Security (Part A)${T}.txt`)).toBe('Week 10 - Lecture Transcript (Live) - Collective Security (Part A).txt');
    expect(rawName('Jurisprudence', `Jurisprudence - Week 10 - Lecture Slides${T}.pdf`)).toBe('Week 10 - Lecture Slides.pdf');
  });
  it('Marketing keeps its full name', () => {
    expect(rawName('Marketing', `Marketing - Week 13 - Reading - Something (Author, 2020)${T}.pdf`)).toBe('Marketing - Week 13 - Reading - Something (Author, 2020).pdf');
  });
});
