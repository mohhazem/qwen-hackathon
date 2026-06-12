<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const route = useRoute()
const { resolveGame } = useGamesApi()
const game = resolveGame(String(route.params.id))

const store = useGameStore()
const socket = useGameSocket()

// The mock "socket" must only run client-side, same as the real WS will.
onMounted(() => {
  if (game) socket.connect(game)
})
onUnmounted(() => socket.disconnect())

function replay() {
  if (game) socket.connect(game)
}
</script>

<template>
  <main v-if="!game" class="void">
    <p class="void__seal">✕</p>
    <h1 class="void__title">No Such Session</h1>
    <p class="void__text">The ledger holds no record of “{{ route.params.id }}”.</p>
    <NuxtLink to="/" class="void__link">Return to the lobby</NuxtLink>
  </main>

  <main v-else class="viewer" :class="`viewer--${game.game_type}`">
    <header class="viewer__bar">
      <NuxtLink to="/" class="viewer__back">← Lobby</NuxtLink>
      <h1 class="viewer__name">{{ game.game_type }}</h1>
      <div class="viewer__status">
        <span>№ {{ game.game_id }}</span>
        <span class="viewer__live" :class="{ 'viewer__live--on': store.connected }">
          ● {{ store.connected ? 'live' : store.ended ? 'concluded' : 'idle' }}
        </span>
      </div>
    </header>

    <PhaseBanner />

    <div class="viewer__grid">
      <aside class="viewer__rail">
        <h2 class="panel-label">The Table</h2>
        <AgentCard v-for="agent in store.agents" :key="agent.id" :agent="agent" />
        <p v-if="!store.agents.length" class="viewer__empty dots">Convening</p>
      </aside>

      <DialogueFeed class="viewer__feed" />
      <EventLog class="viewer__ledger" />
    </div>

    <VerdictBanner @replay="replay" />
  </main>
</template>

<style scoped>
/* ── unknown session ── */
.void {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  text-align: center;
  padding: 2rem;
}
.void__seal {
  margin: 0;
  font-size: 1.6rem;
  color: var(--crimson);
  border: 1px solid var(--crimson);
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  transform: rotate(45deg);
}
.void__seal { line-height: 1; }
.void__title {
  margin: 1rem 0 0;
  font-family: var(--font-display);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 1.5rem;
}
.void__text { margin: 0; color: var(--bone-dim); font-size: 0.85rem; }
.void__link {
  margin-top: 1.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-bright);
  text-decoration: none;
  border: 1px solid rgba(201, 162, 39, 0.55);
  padding: 0.8em 1.6em;
  transition: background 0.3s, color 0.3s;
}
.void__link:hover { background: var(--gold); color: var(--ink); }

/* ── viewer ── */
.viewer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 clamp(1rem, 2.5vw, 2rem) 1.1rem;
}
.viewer--werewolf {
  --accent: var(--moon);
  background: radial-gradient(900px 420px at 50% -10%, rgba(60, 90, 150, 0.2), transparent 65%);
}
.viewer--investigation {
  --accent: var(--amber);
  background: radial-gradient(900px 420px at 72% -10%, rgba(210, 154, 58, 0.16), transparent 65%);
}

.viewer__bar {
  display: flex;
  align-items: baseline;
  gap: 1.4rem;
  padding: 1rem 0 0.8rem;
  border-bottom: 1px solid var(--edge-soft);
}
.viewer__back {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bone-faint);
  text-decoration: none;
  transition: color 0.3s;
}
.viewer__back:hover { color: var(--gold-bright); }
.viewer__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}
.viewer__status {
  margin-left: auto;
  display: flex;
  gap: 1.2rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--bone-faint);
}
.viewer__live--on { color: var(--gold-bright); animation: pulse 1.8s infinite; }

.viewer__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 320px;
  gap: 1.1rem;
  padding-top: 1.1rem;
}
.viewer__rail {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-right: 0.2rem;
}
.panel-label {
  margin: 0 0 0.3rem;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bone-faint);
  border-bottom: 1px solid var(--edge-soft);
  padding-bottom: 0.5rem;
}
.viewer__empty {
  color: var(--bone-faint);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 1100px) {
  .viewer__grid { grid-template-columns: 250px minmax(0, 1fr); }
  .viewer__ledger { display: none; }
}
@media (max-width: 760px) {
  .viewer { height: auto; overflow: visible; }
  .viewer__grid { grid-template-columns: 1fr; }
  .viewer__rail { flex-direction: row; overflow-x: auto; padding-bottom: 0.5rem; }
  .viewer__rail .panel-label { display: none; }
}
</style>
