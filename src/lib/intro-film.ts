/*
 * SCENE: Startup film — "everything you've learnt, drawn by one amber light, settles onto the page"
 *        (prompts: docs/plans/background-prompts.md; encoded by scripts/bg-encode.mjs into public/intro/)
 * LENGTH: one 8 s film (time-based, not pinned), once per Sydney day; replaces the 3D intro when the film exists
 * BEATS: amber point → ink constellations (four units) → they settle → empty paper (= the scroll background's first frame)
 * INTENT: a calm, hopeful moment of "it all connects" before work starts
 * SUBJECT: the amber point of light, then the paper it lands on
 * CAMERA / LIGHT: authored in the film (35mm-equivalent dolly, one amber light)
 * SOUND: none (the film is muted; never autoplay sound)
 * REDUCED MOTION: Off / prefers-reduced-motion / low stimulation / Save-Data → never shown; Calm → the last frame fades
 *                 out over 420 ms; Full → the film, skippable at any moment (Esc, click, any key), ending in a 600 ms fade
 * BUDGET: no JS dependencies; one <video> (1080p/1440p/2160p chosen by screen, AV1 WebM with H.264 fallback), poster first
 */
type IntroManifest = Partial<Record<'light' | 'dark', { heights: number[]; duration: number }>>;

const DAYKEY = 'studysite:intro-day';
const sydneyDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());
const html = () => document.documentElement;

export async function introFilmManifest(): Promise<IntroManifest | null> {
  try {
    const r = await fetch('/intro/manifest.json', { cache: 'no-cache' });
    return r.ok ? ((await r.json()) as IntroManifest) : null;
  } catch {
    return null;
  }
}

export function filmAllowed(): boolean {
  try {
    const n = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (html().dataset.motion === 'off' || html().dataset.lowstim === 'on' || n.connection?.saveData) return false;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return localStorage.getItem(DAYKEY) !== sydneyDay();
  } catch {
    return false;
  }
}

const themeNow = (): 'light' | 'dark' => {
  const t = html().dataset.theme;
  if (t === 'dark') return 'dark';
  if (t === 'light' || t === 'white') return 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/** Plays the film over the page. Resolves when it has gone (ended, skipped or failed). */
export async function playIntroFilm(m: IntroManifest, opts: { onStart?: () => void; onEnd?: () => void } = {}): Promise<void> {
  const want = themeNow();
  const theme = m[want] ? want : m.light ? 'light' : m.dark ? 'dark' : null;
  if (!theme) return;
  const set = m[theme]!;
  const px = Math.min(screen.height, innerHeight) * Math.min(devicePixelRatio || 1, 2);
  const h = [...set.heights].sort((a, b) => a - b).find((x) => x >= px * 0.9) ?? Math.max(...set.heights);
  const calm = html().dataset.motion === 'calm';
  try { localStorage.setItem(DAYKEY, sydneyDay()); } catch { /* private mode */ }

  const root = document.createElement('div');
  root.className = 'intro-film';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Intro film');
  root.style.backgroundImage = `url("/intro/${theme}-${calm ? 'last' : 'first'}.webp")`;
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'intro-film__skip';
  skip.innerHTML = 'Skip intro <kbd>Esc</kbd>';
  root.append(skip);
  document.body.append(root);
  html().dataset.scene = 'intro';
  opts.onStart?.();

  let finished = false;
  const finish = () => new Promise<void>((resolve) => {
    if (finished) return resolve();
    finished = true;
    removeEventListener('keydown', onKey, true);
    root.classList.add('is-leaving');
    const done = () => { root.remove(); delete html().dataset.scene; opts.onEnd?.(); resolve(); };
    if (html().dataset.motion === 'off') done();
    else setTimeout(done, calm ? 420 : 600);
  });
  const onKey = (e: KeyboardEvent) => { e.preventDefault(); void finish(); };

  if (calm) {
    // Calm: no film, just the closing still giving way to the page.
    await new Promise((r) => setTimeout(r, 700));
    return finish();
  }

  const video = document.createElement('video');
  video.className = 'intro-film__video';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.disablePictureInPicture = true;
  const webm = document.createElement('source');
  webm.src = `/intro/${theme}-${h}.webm`;
  webm.type = 'video/webm; codecs="av01.0.08M.10"';
  const mp4 = document.createElement('source');
  mp4.src = `/intro/${theme}-${h}.mp4`;
  mp4.type = 'video/mp4';
  video.append(webm, mp4);
  root.prepend(video);

  addEventListener('keydown', onKey, true);
  root.addEventListener('click', () => void finish());
  return new Promise<void>((resolve) => {
    video.addEventListener('ended', () => void finish().then(resolve));
    video.addEventListener('error', () => void finish().then(resolve));
    video.play().catch(() => void finish().then(resolve));
    // Never hold the page for more than the film plus a margin, whatever the network does.
    setTimeout(() => void finish().then(resolve), (set.duration + 4) * 1000);
  });
}
