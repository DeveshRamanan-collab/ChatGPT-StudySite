// Local-first data layer (Dexie over IndexedDB). No server, no accounts. Keys are stable content ids.
import Dexie, { type EntityTable } from 'dexie';
import type { ReviewLogRow } from './fsrs';

export type Confidence = 'sure' | 'unsure' | 'guess';
export type QuestionType = 'mcq' | 'short' | 'long' | 'truefalse' | 'match';

export interface Attempt {
  id?: number;
  questionId: string;
  unit: string;
  concept: string;
  week?: string;
  type: QuestionType;
  answer: unknown;
  /** true/false for auto-marked items; null when self-marked by rubric (see score). */
  correct: boolean | null;
  /** 0–1 for rubric-marked answers. */
  score?: number;
  confidence?: Confidence;
  cbmScore?: number;
  rubricTicks?: string[];
  tier?: 'worked' | 'faded' | 'full';
  mode?: string;
  durationMs: number;
  /** Hint-ladder rungs opened before answering (0 = none). */
  hints?: number;
  /** Which representation the student used just before answering (explainer, flow, aids…): format comparison. */
  via?: string;
  sessionId: string;
  at: number;
}

export interface Criterion {
  conceptId: string;
  /** Correct recalls in the current session (resets when sessionId changes). */
  correctInSession: number;
  sessionId: string;
  learnedAt?: number;
  /** Timestamps of spaced relearn sessions (≥ 1 correct, ≥ 2 days after the previous). */
  relearnSessions: number[];
  securedAt?: number;
  lastCorrectAt?: number;
}

export interface CardState {
  cardId: string;
  /** Serialised ts-fsrs Card. */
  fsrs: Record<string, unknown>;
  due: number;
  reps: number;
  lapses: number;
  lastReview?: number;
  /** 1 when the student suspended the card (kept out of every queue). */
  suspended?: 0 | 1;
}

export interface Requeue {
  id?: number;
  itemId: string;
  dueAt: number;
  reason: 'sure-wrong' | 'wrong' | 'manual';
  done: 0 | 1;
}

export interface Session {
  id: string;
  start: number;
  end?: number;
  unit?: string;
  ifThen?: string;
  blockMinutes?: number;
}

export interface Annotation {
  id?: number;
  route: string;
  anchor: string;
  quote: string;
  note: string;
  at: number;
}

/** Cards the student makes (rubric gaps, sentence-to-card, occlusion). Scheduled like any other card. */
export interface CustomCard {
  id: string;
  concept: string;
  unit: string;
  type: 'basic' | 'cloze' | 'occlusion';
  front: string;
  back: string;
  /** Occlusion cards: image URL (or data: URL for an uploaded image) and masks in 0–1 coordinates. */
  image?: string;
  masks?: { x: number; y: number; w: number; h: number; label: string }[];
  source: string;
  at: number;
}

/** The student's own edit of a content card (front/back or cloze text); shown instead of the generated text. */
export interface CardEdit {
  cardId: string;
  front?: string;
  back?: string;
  at: number;
}

export interface Setting {
  key: string;
  value: unknown;
}

export const db = new Dexie('studysite') as Dexie & {
  attempts: EntityTable<Attempt, 'id'>;
  criterion: EntityTable<Criterion, 'conceptId'>;
  cards: EntityTable<CardState, 'cardId'>;
  requeue: EntityTable<Requeue, 'id'>;
  sessions: EntityTable<Session, 'id'>;
  annotations: EntityTable<Annotation, 'id'>;
  settings: EntityTable<Setting, 'key'>;
  customCards: EntityTable<CustomCard, 'id'>;
  reviews: EntityTable<ReviewLogRow, 'id'>;
  cardEdits: EntityTable<CardEdit, 'cardId'>;
};

db.version(1).stores({
  attempts: '++id, questionId, concept, unit, at, sessionId',
  criterion: 'conceptId',
  cards: 'cardId, due',
  requeue: '++id, itemId, dueAt, done',
  sessions: 'id, start',
  annotations: '++id, route',
  settings: 'key',
});

db.version(2).stores({ customCards: 'id, concept, unit, at' });
db.version(3).stores({ reviews: '++id, cardId, deck, at', cardEdits: 'cardId' });
