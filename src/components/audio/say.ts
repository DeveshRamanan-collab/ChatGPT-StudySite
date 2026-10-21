// Speech for the Listen and Viva tabs: the browser's own voice (speechSynthesis, nothing leaves the device), spoken one
// sentence at a time so captions can follow it. Builds on src/lib/speech.ts (support check, sentence splitting, and its
// stop(), so the page's read-aloud and this never talk over each other) and adds a chosen rate and voice. With sound
// off, sentences are paced silently at reading speed so captions keep the same timing.
import { speechSupported, segmentsOfText, stop as stopReader } from '../../lib/speech';

export interface ListenPrefs {
  /** Speaking rate, 0.9–1.3. */
  rate: number;
  /** voiceURI of the chosen voice; '' = the default (Australian English when there is one). */
  voice: string;
  sound: boolean;
  captions: boolean;
  /** Think time between question and answer, seconds. */
  think: 5 | 10 | 20;
  /** Go on to the next question after each answer. */
  autoNext: boolean;
}

const KEY = 'studysite:listen';
export const RATE_MIN = 0.9;
export const RATE_MAX = 1.3;
export const THINK_TIMES = [5, 10, 20] as const;
export const DEFAULT_PREFS: ListenPrefs = { rate: 1, voice: '', sound: true, captions: true, think: 10, autoNext: true };

export function readPrefs(): ListenPrefs {
  let p: Partial<ListenPrefs> = {};
  try { p = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch {}
  const rate = typeof p.rate === 'number' ? Math.min(RATE_MAX, Math.max(RATE_MIN, p.rate)) : DEFAULT_PREFS.rate;
  return {
    rate,
    voice: typeof p.voice === 'string' ? p.voice : '',
    sound: p.sound !== false && speechSupported(),
    captions: p.captions !== false,
    think: THINK_TIMES.includes(p.think as 5) ? (p.think as ListenPrefs['think']) : DEFAULT_PREFS.think,
    autoNext: p.autoNext !== false,
  };
}

export function writePrefs(p: ListenPrefs) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

/** English voices, Australian first, then British, then the rest. */
export function englishVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  const rank = (v: SpeechSynthesisVoice) => (v.lang === 'en-AU' ? 0 : v.lang.startsWith('en-GB') ? 1 : 2);
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en')).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

function pickVoice(uri: string) {
  const vs = englishVoices();
  return vs.find((v) => v.voiceURI === uri) ?? vs[0];
}

/** Plain spoken text: no Markdown emphasis, no line breaks. */
export const plain = (s: string) => s.replace(/[*_`]+/g, '').replace(/\s+/g, ' ').trim();

/** The sentences `say` will speak (captions render the same list). */
export const sentences = (text: string) => segmentsOfText(plain(text)).map((s) => s.text);

/** Silent pacing: about 160 words a minute at 1×, never under 1.2 s a sentence. */
export const silentMs = (s: string, rate: number) => Math.max(1200, ((s.split(/\s+/).length / 2.7) * 1000) / rate);

let token = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let settle: ((done: boolean) => void) | null = null;

/** Stop whatever `say` is speaking; its promise resolves false. */
export function hush() {
  token++;
  clearTimeout(timer);
  if (speechSupported()) speechSynthesis.cancel();
  const s = settle;
  settle = null;
  s?.(false);
}

/** Speak `text` sentence by sentence from sentence `from`; onSentence fires as each starts. Resolves true when it has
 *  all been said, false when cut off (hush, or another say). */
export function say(text: string, o: { rate: number; voice: string; sound: boolean; from?: number; onSentence?: (i: number) => void }): Promise<boolean> {
  hush();
  stopReader();
  const my = ++token;
  const list = sentences(text);
  return new Promise((resolve) => {
    settle = resolve;
    const finish = (done: boolean) => { if (settle === resolve) settle = null; resolve(done); };
    const at = (i: number) => {
      if (my !== token) return finish(false);
      if (i >= list.length) return finish(true);
      o.onSentence?.(i);
      if (o.sound && speechSupported()) {
        const u = new SpeechSynthesisUtterance(list[i]);
        u.rate = o.rate;
        const v = pickVoice(o.voice);
        u.lang = v?.lang ?? 'en-AU';
        if (v) u.voice = v;
        u.onend = () => at(i + 1);
        // A voice that fails mid-way falls back to silent pacing so the session never stalls.
        u.onerror = (e) => { if (my !== token) return finish(false); if (e.error === 'interrupted' || e.error === 'canceled') return finish(false); timer = setTimeout(() => at(i + 1), silentMs(list[i], o.rate)); };
        speechSynthesis.speak(u);
      } else {
        timer = setTimeout(() => at(i + 1), silentMs(list[i], o.rate));
      }
    };
    at(Math.max(0, o.from ?? 0));
  });
}

/** Wait `ms` (cancellable by hush/say); onTick reports the time left about every 100 ms. */
export function wait(ms: number, onTick?: (left: number) => void): Promise<boolean> {
  const my = token;
  const end = performance.now() + ms;
  return new Promise((resolve) => {
    settle = resolve;
    const finish = (done: boolean) => { if (settle === resolve) settle = null; resolve(done); };
    const tick = () => {
      if (my !== token) return finish(false);
      const left = end - performance.now();
      onTick?.(Math.max(0, left));
      if (left <= 0) return finish(true);
      timer = setTimeout(tick, Math.min(100, left));
    };
    tick();
  });
}
