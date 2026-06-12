<script setup lang="ts">
import type { GameType } from '~/types/events'

const { createGame } = useGamesApi()

const pending = ref<GameType | null>(null)

async function play(type: GameType) {
  if (pending.value) return
  pending.value = type
  const game = await createGame(type)
  await navigateTo(`/games/${game.game_id}`)
}
</script>

<template>
  <main class="lobby">
    <header class="masthead">
      <p class="masthead__tag">Qwen Hackathon · Track 3 · local mock engine</p>
      <h1 class="masthead__title">Agent Society</h1>
      <div class="ornament"><span>❖</span></div>
      <p class="masthead__tagline">hidden roles · machine minds · one verdict</p>
    </header>

    <section class="posters">
      <!-- ── I · WEREWOLF ── -->
      <article
        class="poster poster--werewolf"
        :class="{ 'poster--busy': pending === 'werewolf', 'poster--locked': pending && pending !== 'werewolf' }"
        @click="play('werewolf')"
      >
        <div class="poster__scene">
          <div class="scene-stars" />
          <div class="scene-moon" />
          <svg class="scene-pines scene-pines--far" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 70 L0 52 L14 52 L26 24 L38 52 L52 52 L66 12 L80 52 L94 52 L105 32 L116 52 L134 52 L148 18 L162 52 L178 52 L189 34 L200 52 L216 52 L230 10 L244 52 L258 52 L269 30 L280 52 L296 52 L310 16 L324 52 L338 52 L350 28 L362 52 L400 52 L400 70 Z" />
          </svg>
          <svg class="scene-pines scene-pines--near" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 60 L0 44 L20 44 L40 6 L60 44 L86 44 L104 16 L122 44 L150 44 L172 2 L194 44 L224 44 L240 20 L256 44 L286 44 L306 8 L326 44 L352 44 L366 26 L380 44 L400 44 L400 60 Z" />
          </svg>
        </div>
        <div class="poster__content">
          <span class="poster__numeral">№ I</span>
          <h2 class="poster__title">Werewolf</h2>
          <div class="ornament ornament--accent"><span>☾</span></div>
          <p class="poster__lede">Night falls on eight machine minds. Two of them are lying.</p>
          <ul class="poster__meta">
            <li>8 agents</li>
            <li>hidden roles</li>
            <li>night · debate · vote</li>
          </ul>
          <button class="poster__play" :disabled="!!pending">
            <span v-if="pending === 'werewolf'" class="dots">Convening agents</span>
            <span v-else>Enter the village</span>
          </button>
        </div>
      </article>

      <!-- ── II · INVESTIGATION ── -->
      <article
        class="poster poster--investigation"
        :class="{ 'poster--busy': pending === 'investigation', 'poster--locked': pending && pending !== 'investigation' }"
        @click="play('investigation')"
      >
        <div class="poster__scene">
          <div class="scene-slats" />
          <div class="scene-spot" />
          <div class="scene-cord" />
          <div class="scene-bulb" />
        </div>
        <div class="poster__content">
          <span class="poster__numeral">№ II</span>
          <h2 class="poster__title">Investigation</h2>
          <div class="ornament ornament--accent"><span>❖</span></div>
          <p class="poster__lede">Six suspects. One missing codex. The Inspector never sleeps.</p>
          <ul class="poster__meta">
            <li>6 agents</li>
            <li>one culprit</li>
            <li>interrogate · accuse</li>
          </ul>
          <button class="poster__play" :disabled="!!pending">
            <span v-if="pending === 'investigation'" class="dots">Convening agents</span>
            <span v-else>Open the case</span>
          </button>
        </div>
      </article>
    </section>

    <footer class="colophon">
      <span>REST for commands · WebSocket for whispers · every fact is an event</span>
    </footer>
  </main>
</template>

<style scoped>
.lobby {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: clamp(2rem, 5vh, 4rem) clamp(1rem, 4vw, 3rem) 0;
  background: radial-gradient(1100px 520px at 50% -8%, rgba(201, 162, 39, 0.07), transparent 70%);
}

/* ── masthead ── */
.masthead {
  text-align: center;
  animation: fade-down 0.9s both;
}
.masthead__tag {
  margin: 0 0 1.4rem;
  font-size: 0.66rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--bone-faint);
}
.masthead__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2.4rem, 6.5vw, 4.6rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding-left: 0.22em; /* optically recenter the tracking */
  color: var(--bone);
  text-shadow: 0 0 42px rgba(201, 162, 39, 0.28);
}
.masthead__tagline {
  margin: 0.4rem 0 0;
  font-size: 0.74rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bone-dim);
}

/* gold rule with centre glyph */
.ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin: 1rem 0 0.6rem;
  color: var(--gold);
}
.ornament::before,
.ornament::after {
  content: '';
  width: 64px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.55));
}
.ornament::after {
  background: linear-gradient(90deg, rgba(201, 162, 39, 0.55), transparent);
}
.ornament--accent { color: var(--accent); margin: 0.7rem 0 0.5rem; }
.ornament--accent::before, .ornament--accent::after { width: 34px; }

/* ── posters ── */
.posters {
  display: grid;
  grid-template-columns: repeat(2, minmax(290px, 430px));
  justify-content: center;
  gap: clamp(1.4rem, 4vw, 3rem);
  margin-top: clamp(2rem, 5vh, 3.6rem);
}
@media (max-width: 860px) {
  .posters { grid-template-columns: minmax(280px, 430px); }
}

.poster {
  --accent: var(--gold);
  position: relative;
  min-height: 520px;
  border: 1px solid var(--edge);
  background: var(--ink-raised);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.45s, box-shadow 0.45s;
  animation: rise-in 0.9s 0.25s both;
}
.poster--investigation { animation-delay: 0.4s; }
.poster::after {
  /* inner playbill frame */
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(201, 162, 39, 0.22);
  pointer-events: none;
  z-index: 3;
}
.poster:hover:not(.poster--locked) {
  transform: translateY(-10px) rotate(-0.5deg);
  border-color: rgba(201, 162, 39, 0.55);
  box-shadow: 0 32px 64px -22px rgba(0, 0, 0, 0.85);
}
.poster--investigation:hover:not(.poster--locked) { transform: translateY(-10px) rotate(0.5deg); }
.poster:hover .poster__scene { filter: brightness(1.18); }
.poster--locked { opacity: 0.4; pointer-events: none; filter: saturate(0.4); }
.poster--busy { border-color: var(--gold); }

.poster--werewolf { --accent: var(--moon); }
.poster--investigation { --accent: var(--amber); }

/* ── scenes ── */
.poster__scene {
  position: absolute;
  inset: 0;
  transition: filter 0.45s;
}
.poster--werewolf .poster__scene {
  background: linear-gradient(180deg, #0b1122 0%, #101c38 55%, #0a0f1e 100%);
}
.scene-stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 22% 28%, rgba(225, 235, 255, 0.9) 0 1px, transparent 1.6px),
    radial-gradient(circle at 64% 14%, rgba(225, 235, 255, 0.7) 0 1px, transparent 1.6px),
    radial-gradient(circle at 83% 42%, rgba(225, 235, 255, 0.8) 0 1px, transparent 1.6px),
    radial-gradient(circle at 38% 52%, rgba(225, 235, 255, 0.5) 0 1px, transparent 1.5px),
    radial-gradient(circle at 9% 62%, rgba(225, 235, 255, 0.6) 0 1px, transparent 1.5px),
    radial-gradient(circle at 74% 66%, rgba(225, 235, 255, 0.45) 0 1px, transparent 1.4px);
  background-size: 230px 210px;
}
.scene-moon {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 64px;
  height: 64px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 38% 35%, #f4f7fc, #cfdcf0 60%, #aebfd8);
  box-shadow:
    0 0 36px 10px rgba(190, 210, 245, 0.4),
    0 0 110px 36px rgba(150, 180, 235, 0.16);
}
.scene-pines {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
.scene-pines--far { height: 96px; fill: #0c1530; }
.scene-pines--near { height: 70px; fill: #04091a; }

.poster--investigation .poster__scene {
  background: linear-gradient(165deg, #1a1107 0%, #2a1908 45%, #140d05 100%);
}
.scene-slats {
  position: absolute;
  inset: -20% -12%;
  background: repeating-linear-gradient(115deg, transparent 0 30px, rgba(220, 160, 60, 0.13) 30px 44px);
  animation: drift 14s ease-in-out infinite alternate;
}
.scene-spot {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 68% 20%, rgba(236, 201, 94, 0.22), transparent 46%);
}
.scene-cord {
  position: absolute;
  top: 0;
  left: 68%;
  width: 1px;
  height: 17%;
  background: rgba(220, 180, 90, 0.55);
}
.scene-bulb {
  position: absolute;
  top: 17%;
  left: 68%;
  width: 11px;
  height: 11px;
  transform: translateX(-5px);
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #ffe9b0, #ecc95e 65%, #b98a2e);
  box-shadow: 0 0 26px 8px rgba(236, 201, 94, 0.38), 0 0 80px 30px rgba(236, 201, 94, 0.12);
  animation: bulb-flicker 7s infinite;
}
@keyframes bulb-flicker {
  0%, 89%, 93%, 100% { opacity: 1; }
  91% { opacity: 0.55; }
  92% { opacity: 0.9; }
  96% { opacity: 0.75; }
}

/* ── poster content ── */
.poster__content {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 2;
  padding: 4.2rem 1.6rem 1.8rem;
  text-align: center;
  background: linear-gradient(180deg, transparent, rgba(8, 6, 4, 0.9) 38%);
}
.poster__numeral {
  font-size: 0.68rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
}
.poster__title {
  margin: 0.45rem 0 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.9rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone);
}
.poster__lede {
  margin: 0.5rem auto 0;
  max-width: 30ch;
  font-size: 0.82rem;
  color: var(--bone-dim);
}
.poster__meta {
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.9rem;
  margin: 0.9rem 0 0;
  padding: 0;
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--bone-faint);
}
.poster__meta li + li::before {
  content: '·';
  margin-right: 0.9rem;
  color: var(--edge);
}
.poster__play {
  margin-top: 1.2rem;
  padding: 0.85em 2em;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
  cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.poster:hover:not(.poster--locked) .poster__play {
  background: var(--accent);
  color: var(--ink);
  box-shadow: 0 0 26px color-mix(in srgb, var(--accent) 35%, transparent);
}
.poster--busy .poster__play {
  background: transparent;
  color: var(--gold-bright);
  border-color: var(--gold-bright);
  box-shadow: none;
  animation: pulse 1.6s infinite;
}

/* ── colophon ── */
.colophon {
  margin-top: auto;
  padding: 2.4rem 0 1.4rem;
  text-align: center;
  font-size: 0.64rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-faint);
  animation: rise-in 0.9s 0.6s both;
}
</style>
