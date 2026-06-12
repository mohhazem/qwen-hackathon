<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const store = useGameStore()

const feed = computed(() => store.events.filter(e =>
  e.type === 'agent.message'
  || e.type === 'agent.vote'
  || e.type === 'agent.eliminated'
  || e.type === 'game.phase_changed',
))

const scroller = ref<HTMLElement | null>(null)
watch(() => store.events.length, async () => {
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })
})

function name(id: string): string {
  return store.agentById(id)?.name ?? id
}
function doom(reason: 'killed' | 'voted_out'): string {
  if (reason === 'killed') return 'is found at dawn'
  return store.gameType === 'investigation' ? 'stands accused' : 'is cast out by vote'
}
</script>

<template>
  <section class="feed">
    <h2 class="feed__label">Proceedings</h2>
    <div ref="scroller" class="feed__scroll">
      <TransitionGroup name="entry">
        <template v-for="e in feed" :key="e.seq">
          <div v-if="e.type === 'game.phase_changed'" class="feed__phase">
            {{ PHASE_META[e.payload.phase]?.glyph }}&ensp;{{ PHASE_META[e.payload.phase]?.label }} · {{ roman(e.payload.round) }}
          </div>
          <div v-else-if="e.type === 'agent.message'" class="feed__msg">
            <span class="feed__sigil">{{ name(e.payload.agent_id).charAt(0) }}</span>
            <div class="feed__bubble">
              <span class="feed__name">{{ name(e.payload.agent_id) }}</span>
              <p class="feed__text">{{ e.payload.text }}</p>
            </div>
          </div>
          <div v-else-if="e.type === 'agent.vote'" class="feed__vote">
            {{ name(e.payload.voter_id) }} casts against {{ name(e.payload.target_id) }}
          </div>
          <div v-else-if="e.type === 'agent.eliminated'" class="feed__doom">
            — {{ name(e.payload.agent_id) }} {{ doom(e.payload.reason) }} —
          </div>
        </template>
      </TransitionGroup>
      <p v-if="!feed.length" class="feed__empty dots">The chamber is silent</p>
    </div>
  </section>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--edge-soft);
  background: rgba(19, 16, 9, 0.5);
}
.feed__label {
  margin: 0;
  padding: 0.75rem 1rem 0.55rem;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bone-faint);
  border-bottom: 1px solid var(--edge-soft);
}
.feed__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.8rem 1rem 1rem;
}

.feed__msg {
  display: flex;
  gap: 0.65rem;
  padding: 0.55rem 0.7rem;
  background: var(--ink-raised);
  border: 1px solid var(--edge-soft);
  border-left: 2px solid var(--accent);
}
.feed__sigil {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 0.15rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--edge);
  font-family: var(--font-display);
  font-size: 0.68rem;
  color: var(--accent);
}
.feed__name {
  font-family: var(--font-display);
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.feed__text {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--bone);
}

.feed__phase {
  margin: 0.7rem 0 0.15rem;
  text-align: center;
  font-size: 0.66rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
}
.feed__vote {
  text-align: center;
  font-size: 0.7rem;
  font-style: italic;
  letter-spacing: 0.08em;
  color: var(--bone-dim);
}
.feed__doom {
  margin: 0.3rem 0;
  text-align: center;
  font-size: 0.73rem;
  letter-spacing: 0.16em;
  color: #d4566b;
}
.feed__empty {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--bone-faint);
}

.entry-enter-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.entry-enter-from { opacity: 0; transform: translateY(10px); }
</style>
