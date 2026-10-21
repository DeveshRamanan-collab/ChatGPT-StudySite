// Runs the e2e suite against a production preview on port 4322 (`npm run build` first), away from the dev server
// that agents and HMR keep busy. Usage: npx playwright test -c playwright.prod.config.ts [files]
import base from './playwright.config';
export default {
  ...base,
  webServer: { command: 'npx astro preview --port 4322', port: 4322, reuseExistingServer: true },
  use: { ...base.use, baseURL: 'http://localhost:4322' },
};
