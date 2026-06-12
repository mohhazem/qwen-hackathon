/**
 * ⭐ TS mirror of the backend event contract.
 *
 * Backend counterpart: `backend/app/events/schemas.py` — which DOES NOT EXIST
 * yet. This file is the FE-first proposal of the contract; whoever builds the
 * backend must mirror it there, and from then on the two files change together
 * in the same commit (root CLAUDE.md rule).
 */

export type GameType = 'werewolf' | 'investigation'

export interface AgentInfo {
  id: string
  name: string
  persona: string
}

export type WerewolfPhase = 'night' | 'day_discussion' | 'day_vote'
export type InvestigationPhase = 'briefing' | 'interrogation' | 'deliberation' | 'accusation'
export type GamePhase = WerewolfPhase | InvestigationPhase

/** Every fact the frontend displays arrives wrapped in this envelope. */
interface EventEnvelope<T extends string, P> {
  /** Monotonically increasing per game; backfill + reconnect cursor. */
  seq: number
  game_id: string
  type: T
  ts: string
  payload: P
}

export type GameCreatedEvent = EventEnvelope<'game.created', {
  game_type: GameType
  agents: AgentInfo[]
}>

export type GamePhaseChangedEvent = EventEnvelope<'game.phase_changed', {
  phase: GamePhase
  round: number
}>

export type AgentMessageEvent = EventEnvelope<'agent.message', {
  agent_id: string
  text: string
  channel: 'public' | 'private'
}>

export type AgentVoteEvent = EventEnvelope<'agent.vote', {
  voter_id: string
  target_id: string
}>

export type AgentEliminatedEvent = EventEnvelope<'agent.eliminated', {
  agent_id: string
  reason: 'voted_out' | 'killed'
}>

/** Roles stay hidden until the end — the stream is public information. */
export type GameEndedEvent = EventEnvelope<'game.ended', {
  winner: string
  summary: string
  reveals: { agent_id: string, role: string }[]
}>

export type GameEvent =
  | GameCreatedEvent
  | GamePhaseChangedEvent
  | AgentMessageEvent
  | AgentVoteEvent
  | AgentEliminatedEvent
  | GameEndedEvent
