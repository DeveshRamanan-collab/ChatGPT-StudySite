// PWA helpers: an install prompt (dashboard) and "Save for offline" (settings) that fills the page cache.
import { useEffect, useState } from 'react';

let deferred: any = null;
if (typeof window !== 'undefined') addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; document.dispatchEvent(new Event('studysite:installable')); });

export function InstallPrompt() {
  const [can, setCan] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setCan(!!deferred);
    const on = () => setCan(true);
    document.addEventListener('studysite:installable', on);
    const installed = () => setDone(true);
    addEventListener('appinstalled', installed);
    return () => { document.removeEventListener('studysite:installable', on); removeEventListener('appinstalled', installed); };
  }, []);
  if (done) return <p className="install-note">Installed. StudySite opens from your dock or home screen, offline too.</p>;
  if (!can) return null;
  return (
    <p className="install-row">
      <button className="btn btn--secondary btn--sm" type="button" onClick={async () => { deferred?.prompt(); const r = await deferred?.userChoice; deferred = null; setCan(false); if (r?.outcome === 'accepted') setDone(true); }}>Install StudySite</button>
      <span className="install-note">Works offline; opens in its own window.</span>
    </p>
  );
}

export function SaveOffline() {
  const [state, setState] = useState<string>('');
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported('caches' in window && 'serviceWorker' in navigator), []);
  async function save() {
    try {
      const { pages, data } = await (await fetch('/data/routes.json')).json();
      const pc = await caches.open('pages'), dc = await caches.open('data');
      let n = 0;
      const all = [...pages.map((u: string) => [pc, u]), ...data.map((u: string) => [dc, u])] as [Cache, string][];
      for (let i = 0; i < all.length; i += 8) {
        await Promise.all(all.slice(i, i + 8).map(async ([c, u]) => { try { const r = await fetch(u, { credentials: 'same-origin' }); if (r.ok) { await c.put(u, r); n++; } } catch {} }));
        setState(`Saving… ${Math.min(all.length, i + 8)} of ${all.length}`);
      }
      setState(`Saved ${n} pages and data files for offline use.`);
    } catch (e) { setState(`Could not save: ${(e as Error).message}`); }
  }
  if (!supported) return <p className="install-note">This browser cannot store pages for offline use.</p>;
  return (
    <p className="install-row">
      <button className="btn btn--secondary btn--sm" type="button" onClick={save}>Save for offline</button>
      <span className="install-note" role="status" aria-live="polite">{state || 'Stores every page (about 20 MB) so the whole site works without a connection.'}</span>
    </p>
  );
}
