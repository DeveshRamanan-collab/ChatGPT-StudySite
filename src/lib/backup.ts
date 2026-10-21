// Export / import of everything this device knows about you: every Dexie table plus the studysite:* local
// settings. Optional GitHub Gist sync with a token you paste (stored on this device only; secret gist).
import { hydratePrefs } from './prefs';
import { db } from './db';

export const BACKUP_VERSION = 1;
const TABLES = ['attempts', 'criterion', 'cards', 'requeue', 'sessions', 'annotations', 'settings', 'customCards', 'reviews', 'cardEdits'] as const;
const LOCAL_SKIP = new Set(['studysite:gist-token']);

export interface Backup { app: 'studysite'; version: number; exportedAt: string; tables: Record<string, unknown[]>; local: Record<string, string> }

export async function exportAll(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {};
  for (const t of TABLES) tables[t] = await (db as any)[t].toArray();
  const local: Record<string, string> = {};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; if (k.startsWith('studysite:') && !LOCAL_SKIP.has(k)) local[k] = localStorage.getItem(k)!; } } catch {}
  return { app: 'studysite', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables, local };
}

/** Validate the shape; throws a plain-language error. */
export function parseBackup(text: string): Backup {
  let b: any;
  try { b = JSON.parse(text); } catch { throw new Error('That file is not JSON.'); }
  if (b?.app !== 'studysite' || typeof b.version !== 'number' || typeof b.tables !== 'object') throw new Error('That file is not a StudySite export.');
  if (b.version > BACKUP_VERSION) throw new Error('That export comes from a newer version of StudySite.');
  return b as Backup;
}

/** replace: wipe then load. merge: keep existing rows, add or overwrite by primary key. */
export async function importAll(b: Backup, mode: 'replace' | 'merge' = 'merge') {
  const counts: Record<string, number> = {};
  await db.transaction('rw', TABLES.map((t) => (db as any)[t]), async () => {
    for (const t of TABLES) {
      const rows = (b.tables[t] ?? []) as object[];
      const table = (db as any)[t];
      if (mode === 'replace') await table.clear();
      // Auto-increment tables: drop ids on merge so rows never collide.
      const auto = t === 'attempts' || t === 'requeue' || t === 'annotations' || t === 'reviews';
      await table.bulkPut(mode === 'merge' && auto ? rows.map(({ id, ...r }: any) => r) : rows);
      counts[t] = rows.length;
    }
  });
  try { for (const [k, v] of Object.entries(b.local ?? {})) if (k.startsWith('studysite:') && !LOCAL_SKIP.has(k)) localStorage.setItem(k, v); } catch {}
  await hydratePrefs({ preferDb: true }); // imported preferences apply now, not after a reload
  return counts;
}

export function download(b: Backup) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(b)], { type: 'application/json' }));
  a.download = `studysite-export-${b.exportedAt.slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---- Optional Gist sync ----
const TOKEN = 'studysite:gist-token';
const GIST = 'studysite:gist-id';
const FILE = 'studysite-backup.json';
export const gistToken = () => { try { return localStorage.getItem(TOKEN) || ''; } catch { return ''; } };
export const setGistToken = (t: string) => { try { t ? localStorage.setItem(TOKEN, t) : localStorage.removeItem(TOKEN); } catch {} };

async function gh(path: string, init: RequestInit = {}) {
  const r = await fetch(`https://api.github.com${path}`, { ...init, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${gistToken()}`, ...(init.headers ?? {}) } });
  if (!r.ok) throw new Error(r.status === 401 ? 'GitHub did not accept the token.' : `GitHub said ${r.status}.`);
  return r.json();
}

export async function pushGist() {
  const body = JSON.stringify({ description: 'StudySite backup', public: false, files: { [FILE]: { content: JSON.stringify(await exportAll()) } } });
  let id = ''; try { id = localStorage.getItem(GIST) || ''; } catch {}
  const g = id ? await gh(`/gists/${id}`, { method: 'PATCH', body }) : await gh('/gists', { method: 'POST', body });
  try { localStorage.setItem(GIST, g.id); } catch {}
  return g.id as string;
}

export async function pullGist() {
  let id = ''; try { id = localStorage.getItem(GIST) || ''; } catch {}
  if (!id) {
    const list = await gh('/gists?per_page=100');
    id = list.find((g: any) => g.files?.[FILE])?.id ?? '';
    if (!id) throw new Error('No StudySite backup gist found for this token.');
    try { localStorage.setItem(GIST, id); } catch {}
  }
  const g = await gh(`/gists/${id}`);
  const f = g.files?.[FILE];
  const text = f?.truncated ? await (await fetch(f.raw_url)).text() : f?.content;
  return parseBackup(text ?? '');
}
