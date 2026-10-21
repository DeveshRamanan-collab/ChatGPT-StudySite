import {describe, expect, it} from 'vitest';
import {mkdtemp, mkdir, writeFile, readFile, rm, cp} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {packRelease, safeEntryPath} from '../scripts/pack-release.mjs';
import {restoreRelease} from '../scripts/restore-release.mjs';

describe('checked prebuilt release', () => {
  it('restores a fresh deployment and source data deterministically while preserving existing public source edits', async () => {
    const root = await mkdtemp(join(tmpdir(), 'study-release-'));
    try {
      await mkdir(join(root, 'dist/source-corpus/files'), {recursive:true});
      await mkdir(join(root, 'dist/source-originals'), {recursive:true});
      await writeFile(join(root, 'dist/index.html'), '<!doctype html><h1>Complete build</h1>');
      await writeFile(join(root, 'dist/source-corpus/index.json'), '{"files":["s 5B(1)(c)."]}');
      await writeFile(join(root, 'dist/source-corpus/files/source.json'), '{"text":"\\r\\n[2026] HCA 4; § 7."}');
      const original = Buffer.concat(Array.from({length:64}, (_, i) => createHash('sha256').update(String(i)).digest()));
      await writeFile(join(root, 'dist/source-originals/original.bin'), original);
      await writeFile(join(root, 'dist/empty.txt'), '');
      const first = await packRelease({root, sourceCommit:'fixture', partBytes:512});
      const second = await packRelease({root, sourceCommit:'fixture', partBytes:512});
      expect(second).toEqual(first);
      expect(first.parts.length).toBeGreaterThan(1);
      const deployed = join(root, 'fresh'); await mkdir(deployed);
      await cp(join(root, 'release-assets'), join(deployed, 'release-assets'), {recursive:true});
      const result = await restoreRelease({root:deployed, log:() => {}});
      expect(result.restored).toBe(true);
      expect(await readFile(join(deployed, 'dist/index.html'), 'utf8')).toContain('Complete build');
      expect(await readFile(join(deployed, 'public/source-corpus/index.json'), 'utf8')).toContain('s 5B(1)(c).');
      expect(await readFile(join(deployed, 'public/source-originals/original.bin'))).toEqual(original);
      expect(await readFile(join(deployed, 'dist/empty.txt'), 'utf8')).toBe('');
      await writeFile(join(deployed, 'public/source-corpus/index.json'), 'kept local edit');
      expect((await restoreRelease({root:deployed, log:() => {}})).reason).toBe('already-verified');
      expect(await readFile(join(deployed, 'public/source-corpus/index.json'), 'utf8')).toBe('kept local edit');
    } finally {await rm(root, {recursive:true, force:true});}
  }, 15_000);

  it('rejects a corrupt release part before creating dist or copying source data', async () => {
    const root = await mkdtemp(join(tmpdir(), 'study-release-corrupt-'));
    try {
      await mkdir(join(root, 'dist'), {recursive:true});
      await writeFile(join(root, 'dist/index.html'), '<h1>Must not publish corrupt files</h1>');
      const manifest = await packRelease({root, sourceCommit:'fixture'});
      const fresh = join(root, 'fresh'); await mkdir(fresh);
      await cp(join(root, 'release-assets'), join(fresh, 'release-assets'), {recursive:true});
      const part = join(fresh, 'release-assets', manifest.parts[0].filename), bytes = await readFile(part);
      bytes[0] ^= 1; await writeFile(part, bytes);
      await expect(restoreRelease({root:fresh, log:() => {}})).rejects.toThrow('checksum mismatch');
      await expect(readFile(join(fresh, 'dist/index.html'))).rejects.toMatchObject({code:'ENOENT'});
    } finally {await rm(root, {recursive:true, force:true});}
  });

  it('rejects absolute, traversal and ambiguous archive paths', () => {
    for(const path of ['/dist/index.html', 'dist/../outside', 'dist/a/../../outside', 'dist//file', 'dist\\file', 'other/file']) expect(() => safeEntryPath(path)).toThrow();
  });
});
