import { defineConfig } from '@playwright/test'

/** Runs both framework applications and verifies their task flow in a real browser. */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    // macOS 12 cannot download Playwright Chromium; use installed Chrome locally.
    // CI deliberately uses Playwright's pinned Chromium for reproducibility.
    channel: process.env.CI ? undefined : 'chrome',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev:next',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:nuxt',
      // Nuxt's macOS development server binds localhost rather than 127.0.0.1.
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
