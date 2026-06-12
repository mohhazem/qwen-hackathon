export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Base URL of the Python backend.
      apiBase: 'http://127.0.0.1:8000',
    },
  },
})
