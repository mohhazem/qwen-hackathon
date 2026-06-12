import type { GameEvent } from '~/types/events'
import type { GameSummary } from '~/types/game'
import { investigationScript, werewolfScript } from '~/mocks/scripts'
import { useGameStore } from '~/stores/game'

/**
 * The ONLY source of game events. MOCK: stands in for the one-way
 * `ws://{apiBase}/ws/games/{id}` stream by replaying a scripted timeline
 * through the same envelope and the same single store dispatch the real
 * socket will use. Components never touch this — they read the store.
 *
 * Real version: open a WebSocket, send last seen `seq` on reconnect,
 * dispatch every parsed message to `store.applyEvent`.
 */
export function useGameSocket() {
  const store = useGameStore()
  let timer: ReturnType<typeof setTimeout> | undefined

  function connect(game: GameSummary) {
    disconnect()
    store.reset(game.game_id)
    store.connected = true

    const script = game.game_type === 'werewolf' ? werewolfScript : investigationScript
    let index = 0
    let seq = 0

    const next = () => {
      const step = script[index++]
      if (!step) {
        store.connected = false
        return
      }
      timer = setTimeout(() => {
        store.applyEvent({
          seq: ++seq,
          game_id: game.game_id,
          type: step.type,
          ts: new Date().toISOString(),
          payload: step.payload,
        } as GameEvent)
        next()
      }, step.wait)
    }

    next()
  }

  function disconnect() {
    if (timer) clearTimeout(timer)
    timer = undefined
    store.connected = false
  }

  return { connect, disconnect }
}
