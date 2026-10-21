// Brown / pink noise in Web Audio: a looped 6-second buffer, no files. Off by default; started only by the student.
// Pink: Paul Kellet's filter; brown: integrated white noise. One module-level context survives page changes.
let ctx: AudioContext | null = null;
let src: AudioBufferSourceNode | null = null;
let gain: GainNode | null = null;
let kind: 'brown' | 'pink' | null = null;

function buffer(c: AudioContext, k: 'brown' | 'pink') {
  const len = c.sampleRate * 6;
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (k === 'pink') {
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
    } else {
      last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5;
    }
  }
  // Cross-fade the loop point to avoid a click.
  const f = Math.floor(c.sampleRate * 0.05);
  for (let i = 0; i < f; i++) { const t = i / f; d[i] = d[i] * t + d[len - f + i] * (1 - t); }
  return b;
}

export function playNoise(k: 'brown' | 'pink', volume: number) {
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  ctx ??= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  if (kind !== k) {
    stopNoise();
    gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    src = ctx.createBufferSource();
    src.buffer = buffer(ctx, k);
    src.loop = true;
    src.connect(gain);
    src.start();
    kind = k;
  }
  gain!.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)) * 0.5, ctx.currentTime, 0.2);
}
export function setNoiseVolume(v: number) { if (ctx && gain) gain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)) * 0.5, ctx.currentTime, 0.1); }
export function stopNoise() {
  if (src && gain && ctx) { const s = src; gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1); setTimeout(() => { try { s.stop(); } catch {} }, 400); }
  src = null; kind = null;
}
export const noisePlaying = () => kind;
