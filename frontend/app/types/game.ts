import type { GameType } from './events'

export type GameStatus = 'created' | 'running' | 'ended'

/** Shape of REST responses from POST /api/games and GET /api/games/{id}. */
export interface GameSummary {
  game_id: string
  game_type: GameType
  status: GameStatus
  created_at: string
}
