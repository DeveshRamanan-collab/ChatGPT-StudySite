// Marks the intro film as already seen today so route tests start on the real home page.
// e2e/intro.spec.ts clears it to test the film itself.
import { writeFileSync, mkdirSync } from 'node:fs';
export default function globalSetup() {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());
  mkdirSync('.cache', { recursive: true });
  writeFileSync('.cache/playwright-storage.json', JSON.stringify({ cookies: [], origins: ['http://localhost:4321', 'http://localhost:4322'].map((origin) => ({ origin, localStorage: [{ name: 'studysite:intro-day', value: day }] })) }));
}
