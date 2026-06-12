export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  // Flat component names: components/game/PhaseBanner.vue -> <PhaseBanner/>
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      title: 'Agent Society',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      // Base URL of the Python backend.
      apiBase: 'http://127.0.0.1:8000',
    },
  },
})
