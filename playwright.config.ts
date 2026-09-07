import { defineConfig } from '@playwright/test'

/** 両 framework application を起動し、実 browser で task flow を検証する Playwright 設定。 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    // macOS 12 では Playwright Chromium を download できないため、local ではインストール済み Chrome を使います。
    // CI では再現性のため、Playwright が固定した Chromium を意図的に使います。
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
      // macOS の Nuxt development server は 127.0.0.1 ではなく localhost に bind します。
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
