<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const store = useGameStore()

const meta = computed(() => (store.phase ? PHASE_META[store.phase] : null))
</script>

<template>
  <div class="phase" :class="{ 'phase--night': store.phase === 'night' }">
    <Transition name="phase" mode="out-in">
      <div v-if="meta" :key="store.phase ?? ''" class="phase__inner">
        <span class="phase__glyph">{{ meta.glyph }}</span>
        <span class="phase__label">{{ meta.label }}</span>
        <span class="phase__round">Round {{ roman(store.round) }}</span>
      </div>
      <div v-else class="phase__inner">
        <span class="phase__label phase__label--idle dots">The session convenes</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.phase {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--edge-soft);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
  text-align: center;
}
.phase--night {
  background: linear-gradient(180deg, rgba(80, 110, 170, 0.12), transparent);
}
.phase__inner {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1.1rem;
}
.phase__glyph {
  font-size: 1.25rem;
  color: var(--accent);
  line-height: 1;
}
.phase__label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bone);
}
.phase__label--idle {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--bone-faint);
}
.phase__round {
  font-size: 0.66rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-faint);
}

.phase-enter-active { transition: opacity 0.5s, transform 0.5s; }
.phase-leave-active { transition: opacity 0.25s, transform 0.25s; }
.phase-enter-from { opacity: 0; transform: translateY(8px); }
.phase-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
