/** Nuxt configuration, including the public debug-mode flag. */
export default defineNuxtConfig({
  compatibilityDate: '2026-09-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // NUXT_PUBLIC_DEBUG_MODE=true でブラウザ用の state inspector を表示します。
      debugMode: false,
    },
  },
})
