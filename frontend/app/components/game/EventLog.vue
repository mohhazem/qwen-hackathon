<script setup lang="ts">
import type { GameEvent } from '~/types/events'
import { useGameStore } from '~/stores/game'

const store = useGameStore()

const scroller = ref<HTMLElement | null>(null)
watch(() => store.events.length, async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
})

function brief(e: GameEvent): string {
  switch (e.type) {
    case 'game.created':
      return `${e.payload.game_type} · ${e.payload.agents.length} agents`
    case 'game.phase_changed':
      return `${e.payload.phase} · r${e.payload.round}`
    case 'agent.message':
      return `${e.payload.agent_id}: “${e.payload.text.slice(0, 34)}${e.payload.text.length > 34 ? '…' : ''}”`
    case 'agent.vote':
      return `${e.payload.voter_id} → ${e.payload.target_id}`
    case 'agent.eliminated':
      return `${e.payload.agent_id} (${e.payload.reason})`
    case 'game.ended':
      return `winner: ${e.payload.winner}`
  }
}
</script>

<template>
  <aside class="ledger">
    <h2 class="ledger__label">Event Ledger <span class="ledger__seqcount">seq {{ store.lastSeq }}</span></h2>
    <div ref="scroller" class="ledger__scroll">
      <p
        v-for="e in store.events"
        :key="e.seq"
        class="ledger__row"
        :class="{ 'ledger__row--game': e.type.startsWith('game.') }"
      >
        <span class="ledger__seq">{{ String(e.seq).padStart(3, '0') }}</span>
        <span class="ledger__body"><b>{{ e.type }}</b> {{ brief(e) }}</span>
      </p>
      <p v-if="!store.events.length" class="ledger__empty">— awaiting first event —</p>
    </div>
  </aside>
</template>

<style scoped>
.ledger {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--edge-soft);
  background: var(--ink-deep);
}
.ledger__label {
  margin: 0;
  padding: 0.75rem 1rem 0.55rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bone-faint);
  border-bottom: 1px solid var(--edge-soft);
}
.ledger__seqcount { letter-spacing: 0.12em; color: var(--gold); }
.ledger__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.6rem 1rem 1rem;
}
.ledger__row {
  display: flex;
  gap: 0.55rem;
  margin: 0;
  padding: 0.22rem 0;
  font-size: 0.66rem;
  line-height: 1.5;
  color: var(--bone-faint);
  border-bottom: 1px dashed rgba(43, 36, 21, 0.45);
}
.ledger__seq { flex-shrink: 0; color: var(--bone-faint); opacity: 0.6; }
.ledger__body { word-break: break-word; }
.ledger__body b { font-weight: 500; color: var(--bone-dim); }
.ledger__row--game .ledger__body b { color: var(--gold); }
.ledger__empty {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.68rem;
  color: var(--bone-faint);
}
</style>
