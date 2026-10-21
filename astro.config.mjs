// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/lib/remark-callouts.mjs';
import rehypeMentions from './src/lib/rehype-mentions.mjs';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    // Offline: the app shell, scripts, styles, fonts and the main pages are precached; every other page and data
    // file is cached the first time it is opened (network first, cache when offline). Settings → "Save for offline"
    // fetches the rest.
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'StudySite', short_name: 'StudySite', description: 'Personal exam revision.', lang: 'en-AU',
        start_url: '/', scope: '/', display: 'standalone', background_color: '#FBF7F0', theme_color: '#FBF7F0',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['_astro/*.{js,css}', 'fonts/*.woff2', 'index.html', 'dashboard/index.html', 'plan/index.html', 'settings/index.html', 'cards/index.html', 'offline/index.html', 'favicon.svg'],
        navigateFallback: null,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          { urlPattern: ({ request }) => request.mode === 'navigate', handler: 'NetworkFirst', options: { cacheName: 'pages', networkTimeoutSeconds: 3, expiration: { maxEntries: 600 }, precacheFallback: { fallbackURL: '/offline/index.html' } } },
          { urlPattern: /\/(data|pagefind)\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'data', expiration: { maxEntries: 400 } } },
        ],
      },
    }),
  ],
  markdown: { remarkPlugins: [remarkDirective, remarkCallouts], rehypePlugins: [rehypeMentions] },
  vite: {
    server: { allowedHosts: ['terminal.local'] },
    build: {
      rollupOptions: {
        // three.js is one shared vendor chunk for every 3D explainer (budget: scripts/budget.mjs).
        output: { manualChunks: (id) => (id.includes('/node_modules/three/') ? 'three' : undefined) },
      },
    },
  },
});
