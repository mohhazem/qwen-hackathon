import type { GameType } from '~/types/events'
import type { GameSummary } from '~/types/game'

/**
 * Game commands (REST). MOCK: the backend has no games API yet, so
 * `createGame` fabricates the exact response shape `POST /api/games` will
 * return — swap its body for a `$fetch` call when the endpoint exists.
 *
 * The game type is encoded in the mock id prefix so the viewer can resolve
 * a game from the URL alone. (A real backend uses opaque ids; the viewer
 * learns the game type from the `game.created` event in the WS backfill.)
 */

const ID_PREFIX: Record<GameType, string> = {
  werewolf: 'ww',
  investigation: 'inv',
}

export function useGamesApi() {
  async function createGame(gameType: GameType): Promise<GameSummary> {
    // Real version:
    //   return $fetch(`${useRuntimeConfig().public.apiBase}/api/games`,
    //     { method: 'POST', body: { game_type: gameType } })
    await new Promise(resolve => setTimeout(resolve, 1100)) // "convening agents…"
    return {
      game_id: `${ID_PREFIX[gameType]}-${Math.random().toString(36).slice(2, 8)}`,
      game_type: gameType,
      status: 'created',
      created_at: new Date().toISOString(),
    }
  }

  function resolveGame(gameId: string): GameSummary | null {
    const entry = (Object.entries(ID_PREFIX) as [GameType, string][])
      .find(([, prefix]) => gameId.startsWith(`${prefix}-`))
    if (!entry) return null
    return { game_id: gameId, game_type: entry[0], status: 'running', created_at: '' }
  }

  return { createGame, resolveGame }
}
