import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.ts',
  webServer: { command: 'npm run preview -- --port 4321', port: 4321, reuseExistingServer: true },
  // Service workers are blocked so page.route fixtures always apply; e2e/extras.spec.ts re-enables them for the PWA test.
  // Locally the installed Google Chrome is used (the pinned Chromium download stalls on this Mac); CI uses Playwright's.
  use: { channel: process.env.CI ? undefined : 'chrome', baseURL: 'http://localhost:4321', storageState: '.cache/playwright-storage.json', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
