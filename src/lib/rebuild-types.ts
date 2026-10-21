export interface LibraryItem {
  id: string; kind: 'case' | 'provision'; title: string; citation: string; href: string;
  units: string[]; weeks: string[]; topics: string[]; court: string; year: number | null;
  listed: boolean; listNumber?: number; listScope?: string; oneLine: string; plain: string; concrete: string;
  facts: string[]; issue: string; reasoning: string[]; outcome: string; rule: string; text: string;
  limits: string[]; conditions: string[]; exceptions: string[]; pitfalls: string[]; examUse: string;
  sourceNotes: string[]; sources: string[]; verification: string; verificationNote: string;
  originals: { label: string; text: string }[]; related: string[];
}
export interface JumpItem { title: string; href: string; kind: string; unit: string; week?: number; description?: string }
export interface StudySlot { start: string; end: string; title: string; unit?: string; week?: number; kind: string; where?: string; description?: string }
export const FIRST_LINE = (s: string) => (s || '').replace(/\s+/g, ' ').trim().match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || s;
export const unique = <T,>(xs: T[]) => [...new Set(xs)];
