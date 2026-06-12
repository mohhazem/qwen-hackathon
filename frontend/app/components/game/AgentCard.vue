<script setup lang="ts">
import type { AgentState } from '~/stores/game'
import { useGameStore } from '~/stores/game'

const props = defineProps<{ agent: AgentState }>()
const store = useGameStore()

const speaking = computed(() =>
  props.agent.alive && store.connected && store.lastSpeakerId === props.agent.id,
)
const votesAgainst = computed(() => store.voteTally[props.agent.id] ?? 0)
const stamp = computed(() => {
  if (props.agent.eliminated === 'killed') return 'slain'
  if (props.agent.eliminated === 'voted_out')
    return store.gameType === 'investigation' ? 'accused' : 'exiled'
  return null
})
const darkRole = computed(() => props.agent.role === 'werewolf' || props.agent.role === 'culprit')
</script>

<template>
  <div class="agent" :class="{ 'agent--down': !agent.alive, 'agent--speaking': speaking }">
    <span class="agent__sigil"><i>{{ agent.name.charAt(0) }}</i></span>
    <span class="agent__body">
      <span class="agent__name">{{ agent.name }}</span>
      <span class="agent__persona">{{ agent.persona }}</span>
      <span v-if="agent.role" class="agent__role" :class="darkRole ? 'agent__role--dark' : 'agent__role--light'">
        {{ agent.role }}
      </span>
    </span>
    <span v-if="votesAgainst" class="agent__votes">{{ '✕'.repeat(Math.min(votesAgainst, 8)) }}</span>
    <span v-if="stamp" class="agent__stamp">{{ stamp }}</span>
  </div>
</template>

<style scoped>
.agent {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.6rem 0.7rem;
  border: 1px solid var(--edge-soft);
  background: var(--ink-raised);
  min-width: 200px;
  transition: opacity 0.6s, border-color 0.3s, box-shadow 0.3s, filter 0.6s;
}
.agent--speaking {
  border-color: var(--accent);
  box-shadow: 0 0 16px -5px var(--accent);
}
.agent--down {
  opacity: 0.42;
  filter: grayscale(0.85);
}

.agent__sigil {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  margin: 0.25rem 0.2rem 0 0.2rem;
  display: grid;
  place-items: center;
  transform: rotate(45deg);
  border: 1px solid var(--edge);
  background: var(--ink-deep);
  transition: border-color 0.3s;
}
.agent--speaking .agent__sigil { border-color: var(--accent); }
.agent__sigil i {
  transform: rotate(-45deg);
  font-style: normal;
  font-family: var(--font-display);
  font-size: 0.78rem;
  color: var(--accent);
}

.agent__name {
  display: block;
  font-family: var(--font-display);
  font-size: 0.86rem;
  letter-spacing: 0.08em;
}
.agent__persona {
  display: block;
  font-size: 0.66rem;
  line-height: 1.4;
  color: var(--bone-faint);
}
.agent__role {
  display: inline-block;
  margin-top: 0.35rem;
  padding: 0.05em 0.6em;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid;
}
.agent__role--light { color: var(--gold-bright); border-color: rgba(201, 162, 39, 0.5); }
.agent__role--dark { color: #d4566b; border-color: rgba(163, 38, 56, 0.65); }

.agent__votes {
  position: absolute;
  top: 0.45rem;
  right: 0.55rem;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: #d4566b;
}
.agent__stamp {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%) rotate(-9deg);
  padding: 0.18em 0.55em;
  font-family: var(--font-display);
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #d4566b;
  border: 1px solid rgba(163, 38, 56, 0.6);
  background: rgba(8, 6, 4, 0.7);
}
</style>
