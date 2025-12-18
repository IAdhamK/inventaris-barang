// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Cloudflare Pages deployment
  nitro: {
    preset: 'cloudflare-pages'
  },

  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@nuxt/icon'
  ],

  css: [
    '@/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'Inventaris Barang - Bagian Rumah Tangga dan Perlengkapan',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistem Inventaris Barang di lingkungan Bagian Rumah Tangga dan Perlengkapan' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  }
})
