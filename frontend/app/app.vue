<script setup lang="ts">
const config = useRuntimeConfig()

// Ping the Python backend so we can confirm both halves are wired together.
const { data: backend, error } = await useFetch<{ message: string }>(
  `${config.public.apiBase}/api/hello`,
  { server: false, lazy: true },
)
</script>

<template>
  <main class="page">
    <h1>Hello World from the Agent Society frontend!</h1>
    <p v-if="backend">Backend says: "{{ backend.message }}"</p>
    <p v-else-if="error">Backend not reachable - start it with: uvicorn app.main:app --reload</p>
    <p v-else>Contacting backend...</p>
  </main>
</template>

<style scoped>
.page {
  font-family: system-ui, sans-serif;
  max-width: 40rem;
  margin: 4rem auto;
  text-align: center;
}
</style>
