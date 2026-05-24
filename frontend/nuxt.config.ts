// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/style/main.scss"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image"],

  runtimeConfig: {
    public: {
      // Dev default points at the locally running NestJS. In prod set
      // NUXT_PUBLIC_API_BASE=https://<domain>/api (one domain, /api behind nginx).
      apiBase: "http://localhost:3001/api",
      // Used by /sitemap.xml to build absolute URLs. Override in prod via
      // NUXT_PUBLIC_SITE_URL=https://your-domain.com
      siteUrl: "http://localhost:3000",
      house: {
        title: "Novotarmanskiy house",
        pricePerNight: 5000,
      },
      // Цена доп.услуги "русская баня" (UI на /booking).
      saunaPrice: 3000,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["import"],
        },
      },
    },
  },
});
