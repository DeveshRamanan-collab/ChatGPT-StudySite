// One study block at a time, persisted so it survives page changes (chrome fades while it runs).
export type BlockKind = 'block' | 'two-minute' | 'deep';
export interface BlockPlanItem { label: string; href: string; minutes: number; done?: boolean }
export interface Block { kind: BlockKind; unit: string; ifThen: string; minutes: number; startAt: number; askedKeepGoing?: boolean; toastedDeep?: boolean; energy?: 'low' | 'steady' | 'high'; plan?: BlockPlanItem[] }

const KEY = 'studysite:block';
const LAST_IF_THEN = 'studysite:last-if-then';
export const EVENT = 'studysite:block';

export function readBlock(): Block | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function write(b: Block | null) {
  try { b ? localStorage.setItem(KEY, JSON.stringify(b)) : localStorage.removeItem(KEY); } catch {}
  document.dispatchEvent(new CustomEvent(EVENT, { detail: b }));
}
export function startBlock(b: Omit<Block, 'startAt'>, now = Date.now()) {
  const block = { ...b, startAt: now };
  if (b.ifThen) { try { localStorage.setItem(LAST_IF_THEN, JSON.stringify({ text: b.ifThen, unit: b.unit, at: now })); } catch {} }
  write(block);
  return block;
}
export const updateBlock = (patch: Partial<Block>) => { const b = readBlock(); if (b) write({ ...b, ...patch }); };
export const endBlock = () => write(null);
export function lastIfThen(): { text: string; unit: string; at: number } | null {
  try { return JSON.parse(localStorage.getItem(LAST_IF_THEN) || 'null'); } catch { return null; }
}

/** Seconds left (Infinity for deep-dive) and elapsed seconds. */
export function remaining(b: Block, now = Date.now()) {
  const elapsed = Math.max(0, (now - b.startAt) / 1000);
  return { elapsed, left: b.kind === 'deep' ? Infinity : Math.max(0, b.minutes * 60 - elapsed) };
}

/** A single soft 440 Hz sine, 300ms decay, about −24 dB. Never autoplays: only after a block the student started. */
export function chime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 440;
    g.gain.setValueAtTime(0.063, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.32);
    o.onended = () => ctx.close();
  } catch {}
}
