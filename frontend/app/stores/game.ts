import { defineStore } from 'pinia'
import type { AgentInfo, GameEndedEvent, GameEvent, GamePhase, GameType } from '~/types/events'

export interface AgentState extends AgentInfo {
  alive: boolean
  eliminated: 'voted_out' | 'killed' | null
  /** Hidden until game.ended reveals it. */
  role: string | null
}

export interface ChatMessage {
  seq: number
  agent_id: string
  text: string
  channel: 'public' | 'private'
}

/**
 * All game state is a fold of events: `applyEvent` is the single reducer,
 * fed only by `useGameSocket`. Components read; nothing else writes.
 */
export const useGameStore = defineStore('game', {
  state: () => ({
    gameId: null as string | null,
    gameType: null as GameType | null,
    connected: false,
    events: [] as GameEvent[],
    agents: [] as AgentState[],
    phase: null as GamePhase | null,
    round: 0,
    messages: [] as ChatMessage[],
    /** Current phase's votes, voter_id -> target_id. */
    votes: {} as Record<string, string>,
    ended: null as GameEndedEvent['payload'] | null,
  }),

  getters: {
    lastSeq: state => state.events.length > 0 ? state.events[state.events.length - 1]!.seq : 0,
    agentById: (state) => {
      const byId = new Map(state.agents.map(a => [a.id, a]))
      return (id: string) => byId.get(id)
    },
    aliveCount: state => state.agents.filter(a => a.alive).length,
    lastSpeakerId: state => state.messages.length > 0 ? state.messages[state.messages.length - 1]!.agent_id : null,
    /** target_id -> number of votes against them, this phase. */
    voteTally: (state) => {
      const tally: Record<string, number> = {}
      for (const target of Object.values(state.votes)) tally[target] = (tally[target] ?? 0) + 1
      return tally
    },
  },

  actions: {
    reset(gameId: string) {
      this.$reset()
      this.gameId = gameId
    },

    applyEvent(event: GameEvent) {
      this.events.push(event)

      switch (event.type) {
        case 'game.created':
          this.gameType = event.payload.game_type
          this.agents = event.payload.agents.map(a => ({ ...a, alive: true, eliminated: null, role: null }))
          break

        case 'game.phase_changed':
          this.phase = event.payload.phase
          this.round = event.payload.round
          this.votes = {}
          break

        case 'agent.message':
          this.messages.push({ seq: event.seq, ...event.payload })
          break

        case 'agent.vote':
          this.votes[event.payload.voter_id] = event.payload.target_id
          break

        case 'agent.eliminated': {
          const agent = this.agents.find(a => a.id === event.payload.agent_id)
          if (agent) {
            agent.alive = false
            agent.eliminated = event.payload.reason
          }
          break
        }

        case 'game.ended': {
          this.ended = event.payload
          for (const reveal of event.payload.reveals) {
            const agent = this.agents.find(a => a.id === reveal.agent_id)
            if (agent) agent.role = reveal.role
          }
          break
        }
      }
    },
  },
})
