<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const store = useGameStore()
defineEmits<{ replay: [] }>()

const WINNER_LABELS: Record<string, string> = {
  village: 'The Village Prevails',
  werewolves: 'The Wolves Feast',
  investigation: 'Case Closed',
  culprit: 'The Culprit Walks',
}
const headline = computed(() =>
  store.ended ? (WINNER_LABELS[store.ended.winner] ?? store.ended.winner) : '',
)

function darkRole(role: string): boolean {
  return role === 'werewolf' || role === 'culprit'
}
</script>

<template>
  <div v-if="store.ended" class="verdict">
    <div class="verdict__card">
      <p class="verdict__kicker">· the verdict ·</p>
      <h2 class="verdict__headline">{{ headline }}</h2>
      <p class="verdict__summary">{{ store.ended.summary }}</p>
      <ul class="verdict__reveals">
        <li v-for="r in store.ended.reveals" :key="r.agent_id">
          <span class="verdict__agent">{{ store.agentById(r.agent_id)?.name ?? r.agent_id }}</span>
          <span class="verdict__dotline" />
          <span class="verdict__role" :class="{ 'verdict__role--dark': darkRole(r.role) }">{{ r.role }}</span>
        </li>
      </ul>
      <div class="verdict__actions">
        <button class="verdict__btn" @click="$emit('replay')">Replay</button>
        <NuxtLink to="/" class="verdict__btn verdict__btn--ghost">Return to lobby</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verdict {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(8, 6, 4, 0.84);
  backdrop-filter: blur(4px);
  animation: verdict-fade 0.5s both;
}
@keyframes verdict-fade {
  from { opacity: 0; }
}
.verdict__card {
  position: relative;
  width: min(460px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.2rem 2.3rem;
  text-align: center;
  background: var(--ink-raised);
  border: 1px solid rgba(201, 162, 39, 0.55);
  animation: rise-in 0.7s 0.15s both;
}
.verdict__card::after {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(201, 162, 39, 0.2);
  pointer-events: none;
}
.verdict__kicker {
  margin: 0;
  font-size: 0.64rem;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: var(--bone-faint);
}
.verdict__headline {
  margin: 0.5rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-bright);
}
.verdict__summary {
  margin: 0 auto;
  max-width: 40ch;
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--bone-dim);
}
.verdict__reveals {
  list-style: none;
  margin: 1.4rem 0 0;
  padding: 0;
}
.verdict__reveals li {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.24rem 0;
  font-size: 0.78rem;
}
.verdict__agent { font-family: var(--font-display); letter-spacing: 0.08em; }
.verdict__dotline { flex: 1; border-bottom: 1px dotted var(--edge); }
.verdict__role {
  font-size: 0.64rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bone-dim);
}
.verdict__role--dark { color: #d4566b; }

.verdict__actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.6rem;
  position: relative;
  z-index: 1;
}
.verdict__btn {
  padding: 0.75em 1.6em;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gold-bright);
  background: transparent;
  border: 1px solid rgba(201, 162, 39, 0.6);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
}
.verdict__btn:hover { background: var(--gold); color: var(--ink); }
.verdict__btn--ghost { color: var(--bone-dim); border-color: var(--edge); }
.verdict__btn--ghost:hover { background: transparent; color: var(--gold-bright); border-color: rgba(201, 162, 39, 0.6); }
</style>
