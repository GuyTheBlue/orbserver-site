// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/google-fonts'
  ],

  devtools: {
    enabled: false
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'suncalc'
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleFonts: {
    families: {
      Roboto: [400, 500, 700],
      Orbitron: [400, 700, 900]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true
  }
})
