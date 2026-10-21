// Settings: every per-device preference in one place (theme, motion, glass, rail, reading line, scrollbar, cursor,
// intro, companion, noise, deep dive). Values live in the prefs store (src/lib/prefs.ts): IndexedDB + a localStorage
// mirror the pre-paint script reads. Export / import and offline sit below this panel on /settings.
import { useEffect, useState } from 'react';
import { usePrefs, setPrefs, DEFAULTS, type Prefs } from '../lib/prefs';
import { playNoise, stopNoise, setNoiseVolume } from '../lib/noise';
import { startBlock } from '../lib/block';
import { GlassFields } from './GlassControl';
import { canReplayIntro, replayIntro } from '../lib/replay';
import { setLowStim } from '../lib/lowstim';

export default function SettingsPanel() {
  const stored = usePrefs();
  const [mounted, setMounted] = useState(false);
  const [motionNow, setMotionNow] = useState('full');
  const [replay, setReplay] = useState(false);
  const [fine, setFine] = useState(true);
  useEffect(() => {
    const sync = () => { setMotionNow(document.documentElement.dataset.motion || 'full'); setReplay(canReplayIntro()); };
    sync();
    setFine(matchMedia('(hover: hover) and (pointer: fine)').matches);
    setMounted(true);
    document.addEventListener('motionchange', sync);
    return () => document.removeEventListener('motionchange', sync);
  }, []);
  // Values come from this device's storage. Before mount (server and first client render) the same layout is drawn
  // with the defaults and disabled, so the page does not shift when the stored values arrive (CLS).
  const p: Prefs = mounted ? stored : DEFAULTS;

  const update = (patch: Partial<Prefs>) => {
    const next = setPrefs(patch);
    if ('noise' in patch) next.noise === 'off' ? stopNoise() : playNoise(next.noise, next.volume);
    if ('volume' in patch) setNoiseVolume(next.volume);
  };
  const seg = (name: string, value: string, options: [string, string][], on: (v: string) => void) => (
    <div className="settings-seg" role="radiogroup" aria-label={name}>
      {options.map(([v, label]) => (
        <label key={v} className="settings-seg__opt"><input type="radio" name={name} value={v} checked={value === v} disabled={!mounted} onChange={() => on(v)} /><span>{label}</span></label>
      ))}
    </div>
  );
  const setTheme = (v: string) => import('../lib/theme').then((m) => m.setTheme(v as Prefs['theme']));
  const setMotion = (v: string) => import('../lib/motion').then((m) => m.setMotion(v as 'full' | 'calm' | 'off'));
  const setRailDefault = (v: string) => {
    const rail = v === 'auto' ? null : (v as 'open' | 'collapsed');
    update({ rail });
    import('../lib/chrome').then((m) => m.setRail(rail ?? m.defaultRail(), false));
  };

  return (
    <div className="settings">
      <section aria-labelledby="set-theme">
        <h2 id="set-theme">Theme</h2>
        <p>Light is warm paper; White is the same on a pure white page. Lamp-lit is a warm dark theme for evening study. Auto follows your device.</p>
        {seg('Theme', p.theme, [['light', 'Light'], ['white', 'White'], ['dark', 'Dark (lamp-lit)'], ['auto', 'Auto']], setTheme)}
      </section>
      <section aria-labelledby="set-motion">
        <h2 id="set-motion">Motion</h2>
        <p>Full moves the page with your scroll. Calm keeps fades and drops movement. Off keeps only short fades. If your device asks for reduced motion, Off is used until you choose here.</p>
        {seg('Motion', motionNow, [['full', 'Full'], ['calm', 'Calm'], ['off', 'Off']], setMotion)}
      </section>
      <section aria-labelledby="set-glass">
        <h2 id="set-glass">Glass</h2>
        <p>Warm, translucent surfaces for the header, rail, menu, palette, popovers and toasts. Reading text always sits on opaque paper.</p>
        <GlassFields idPrefix="glass-set" />
      </section>
      <section aria-labelledby="set-rail">
        <h2 id="set-rail">Contents rail</h2>
        <p>The “On this page” list beside long pages. Automatic opens it on wide screens. The <kbd className="kbd">]</kbd> key shows or hides it on any page.</p>
        {seg('Contents rail', p.rail ?? 'auto', [['auto', 'Automatic'], ['open', 'Open'], ['collapsed', 'Hidden']], setRailDefault)}
      </section>
      <section aria-labelledby="set-reading">
        <h2 id="set-reading">Reading</h2>
        <p>A thin line showing how far through a page you are, at the top and along the contents rail. Off by default.</p>
        {seg('Reading progress line', p.progress ? 'on' : 'off', [['off', 'Off'], ['on', 'On']], (v) => update({ progress: v === 'on' }))}
        <p>The scrollbar is thin and in the page colours. You can hide it entirely; scrolling still works.</p>
        {seg('Scrollbar', p.hideScrollbar ? 'hidden' : 'shown', [['shown', 'Show scrollbar'], ['hidden', 'Hide scrollbar']], (v) => update({ hideScrollbar: v === 'hidden' }))}
      </section>
      <section aria-labelledby="set-text">
        <h2 id="set-text">Text</h2>
        <p>Size, spacing and line width of reading text. Changes show on this page straight away and apply everywhere.</p>
        <p className="label">Text size</p>
        {seg('Text size', p.textSize, [['sm', 'Smaller'], ['md', 'Standard'], ['lg', 'Larger'], ['xl', 'Largest']], (v) => update({ textSize: v as Prefs['textSize'] }))}
        <p className="label">Line spacing</p>
        {seg('Line spacing', p.leading, [['normal', 'Standard'], ['relaxed', 'Relaxed'], ['airy', 'Airy']], (v) => update({ leading: v as Prefs['leading'] }))}
        <p className="label">Line width</p>
        {seg('Line width', p.measure, [['narrow', 'Narrow'], ['normal', 'Standard'], ['wide', 'Wide']], (v) => update({ measure: v as Prefs['measure'] }))}
        <p className="label">Contrast</p>
        {seg('Contrast', p.contrast, [['normal', 'Standard'], ['high', 'Higher']], (v) => update({ contrast: v as Prefs['contrast'] }))}
        <p className="label">Density</p>
        {seg('Density', p.density, [['comfortable', 'Comfortable'], ['compact', 'Compact']], (v) => update({ density: v as Prefs['density'] }))}
      </section>
      <section aria-labelledby="set-lowstim">
        <h2 id="set-lowstim">Low stimulation</h2>
        <p>One switch for a quieter screen: no movement, no glass or glow, the system cursor, no companion or noise, and the contents rail tucked away. Turning it off puts your previous choices back.</p>
        {seg('Low stimulation', p.lowStim ? 'on' : 'off', [['off', 'Off'], ['on', 'On']], (v) => { setLowStim(v === 'on'); })}
      </section>
      <section aria-labelledby="set-cursor">
        <h2 id="set-cursor">Cursor</h2>
        <p>A soft dot and ring that follow the pointer and show what you can do. It needs a mouse or trackpad and Motion set to Full{fine ? '' : ' (this device has neither a mouse nor a trackpad)'}.</p>
        {seg('Cursor', p.cursor, [['on', 'On'], ['off', 'Off (system cursor)']], (v) => update({ cursor: v as Prefs['cursor'] }))}
      </section>
      <section aria-labelledby="set-start">
        <h2 id="set-start">Start</h2>
        <p>When you refresh or come back to the site, it opens at the top of the home page. Turn this off to stay on the page you were on.</p>
        {seg('Open on the home page', p.homeOnLoad ? 'on' : 'off', [['on', 'On'], ['off', 'Off']], (v) => update({ homeOnLoad: v === 'on' }))}
      </section>
      <section aria-labelledby="set-intro">
        <h2 id="set-intro">Intro</h2>
        <p>An optional short film. Play it when you choose; it needs Motion set to Full. The home page opens immediately by default.</p>
        <p className="settings-actions"><button className="btn btn--secondary" type="button" disabled={!replay} onClick={replayIntro}>Replay intro</button></p>
      </section>
      <section aria-labelledby="set-companion">
        <h2 id="set-companion">Study companion</h2>
        <p>A small lamp that sits beside the block timer. Its bar fills with yours and it says one plain sentence at a quarter, half and the end. Nothing else.</p>
        {seg('Companion', p.companion, [['off', 'Off'], ['lamp', 'Lamp']], (v) => update({ companion: v as Prefs['companion'] }))}
      </section>
      <section aria-labelledby="set-noise">
        <h2 id="set-noise">Background noise</h2>
        <p>Brown or pink noise, generated in the browser. Off by default. Some people with ADHD find it steadies attention; if you are the hyperactive type it can make focus worse — try one short block and turn it off if it does.</p>
        {seg('Noise', p.noise, [['off', 'Off'], ['brown', 'Brown'], ['pink', 'Pink']], (v) => update({ noise: v as Prefs['noise'] }))}
        <label className="settings-vol">
          <span className="label">Volume</span>
          <input type="range" min={0} max={1} step={0.05} value={p.volume} disabled={p.noise === 'off'} onChange={(e) => update({ volume: Number(e.target.value) })} aria-valuetext={`${Math.round(p.volume * 100)}%`} data-cursor="drag" />
        </label>
      </section>
      <section aria-labelledby="set-deep">
        <h2 id="set-deep">Deep dive and focus mode</h2>
        <p>Deep dive has no timer end: one soft note at 45 minutes suggests a break. Focus mode hides everything but the card you are working on (Esc to leave).</p>
        <p className="settings-actions">
          <button className="btn btn--secondary" type="button" onClick={() => startBlock({ kind: 'deep', unit: 'due', ifThen: 'Deep dive', minutes: 45 })}>Start a deep dive</button>
          <button className="btn btn--ghost" type="button" onClick={() => document.dispatchEvent(new CustomEvent('studysite:focus', { detail: { toggle: true } }))}>Toggle focus mode</button>
        </p>
      </section>
    </div>
  );
}
