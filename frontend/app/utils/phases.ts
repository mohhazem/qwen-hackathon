import type { GamePhase } from '~/types/events'

export const PHASE_META: Record<GamePhase, { label: string, glyph: string }> = {
  night: { label: 'Night Falls', glyph: '☾' },
  day_discussion: { label: 'The Discussion', glyph: '☉' },
  day_vote: { label: 'The Vote', glyph: '⚖' },
  briefing: { label: 'The Briefing', glyph: '✦' },
  interrogation: { label: 'The Interrogation', glyph: '❖' },
  deliberation: { label: 'The Deliberation', glyph: '☷' },
  accusation: { label: 'The Accusation', glyph: '⚖' },
}

export function roman(n: number): string {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][n - 1] ?? String(n)
}
