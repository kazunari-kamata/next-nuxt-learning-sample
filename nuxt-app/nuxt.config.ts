/** ブラウザ公開用の debug mode 設定を含む Nuxt 設定。 */
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
