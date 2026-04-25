const baseURL = import.meta.env.NUXT_APP_BASE_URL || '/'
const normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
const previewRoute = `${normalizedBaseURL}/preview`

export default defineNuxtConfig({
  compatibilityDate: '2026-04-25',
  app: {
    baseURL,
  },
  css: ['~/styles/main.scss'],
  devtools: { enabled: true },
  nitro: {
    prerender: {
      routes: [baseURL, previewRoute],
    },
  },
  ssr: false,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/styles/shared" as *;',
        },
      },
    },
  },
})
