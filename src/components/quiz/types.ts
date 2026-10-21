// Client-side shapes of the question bank (from /data/<unit>/questions.json).
import type { Confidence } from '../../lib/db';

export interface Option { text: string; correct: boolean; why: string }
interface Base { id: string; unit: string; concept: string; week?: string; difficulty: number; set?: 'pretest' | 'quickfire' | 'revision'; 'variant-of'?: string; cases?: string[] }
export interface McqQ extends Base { type: 'mcq'; stem: string; options: Option[] }
export interface TrueFalseQ extends Base { type: 'truefalse'; statement: string; answer: boolean; why: string }
export interface RubricRow { id: string; criterion: string; marks: number; 'top-band': string; 'margin-note': string; authorities: string[] }
export interface ShortQ extends Base { type: 'short'; prompt: string; model: string; rubric: RubricRow[] }
export interface LongQ extends Base { type: 'long'; tier: 'worked' | 'faded' | 'full'; template: 'ilac' | 'essay'; prompt: string; timer: number; rubric: RubricRow[]; model: string; given?: Record<string, string | string[]>; steps: string[] }
export interface MatchQ extends Base { type: 'match'; prompt: string; pairs: { left: string; right: string }[] }
export type Question = McqQ | TrueFalseQ | ShortQ | LongQ | MatchQ;
export interface ConceptMeta { title: string; href: string; week: string; /** Knowledge-map edges (prerequisite repair, contrast drills). */ dependsOn?: string[]; contrastsWith?: string[] }
export interface WeekMeta { id: string; number: number; topic: string }
export interface CasePair { id: string; name: string; ratio: string }
export interface Bank { unit: string; concepts: Record<string, ConceptMeta>; weeks: WeekMeta[]; cases: CasePair[]; questions: Question[] }
export type { Confidence };

/** True/false rendered as a two-option MCQ so both share the gate, marking and explanation panel. */
export function asChoice(q: McqQ | TrueFalseQ): { stem: string; options: Option[] } {
  if (q.type === 'mcq') return { stem: q.stem, options: q.options };
  return {
    stem: q.statement,
    options: [
      { text: 'True', correct: q.answer, why: q.answer ? q.why : `Tempting, but false: ${q.why}` },
      { text: 'False', correct: !q.answer, why: q.answer ? `Tempting, but true: ${q.why}` : q.why },
    ],
  };
}

export async function loadBank(unit: string): Promise<Bank> {
  const r = await fetch(`/data/${unit}/questions.json`);
  if (!r.ok) throw new Error(`question bank ${unit}: ${r.status}`);
  return r.json();
}
