// Every explainer module (one per concept), lazily imported so each is its own chunk. Bases are excluded.
import type { ComponentType } from 'react';
import manifest from './manifest.json';

export interface ManifestEntry { module: string; base: 'scroll' | 'simulation' | 'palace' | 'three' | 'diagram' | 'timeline'; }
export const MANIFEST = manifest as Record<string, ManifestEntry>;

const modules = import.meta.glob<{ default: ComponentType }>(['./*/*.tsx', '!./bases/*.tsx']);

export function loaderFor(module: string) {
  return modules[`./${module}.tsx`];
}
