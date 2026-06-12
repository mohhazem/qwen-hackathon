/**
 * Scripted mock game timelines, played by `useGameSocket` until the real
 * backend engine + WebSocket exist. Each step waits `wait` ms, then emits
 * its event body through the real envelope into the store reducer.
 *
 * DELETE this file when the backend lands.
 */

import type { GameEvent } from '~/types/events'

type EventBody<E> = E extends { type: infer T, payload: infer P }
  ? { type: T, payload: P }
  : never

export type ScriptStep = { wait: number } & EventBody<GameEvent>

/* ── WEREWOLF ── 8 minds, 2 wolves, 3 rounds (~90 s) ──────────────────── */

export const werewolfScript: ScriptStep[] = [
  { wait: 600, type: 'game.created', payload: {
    game_type: 'werewolf',
    agents: [
      { id: 'aldric', name: 'Aldric', persona: 'stern logician; trusts patterns, not people' },
      { id: 'bram', name: 'Bram', persona: 'jovial storyteller; deflects with charm' },
      { id: 'casimir', name: 'Casimir', persona: 'paranoid; counts everyone’s words' },
      { id: 'delphine', name: 'Delphine', persona: 'soft-spoken; dreams more than she says' },
      { id: 'edda', name: 'Edda', persona: 'blunt accuser; never retracts' },
      { id: 'felix', name: 'Felix', persona: 'nervous optimist; follows the crowd' },
      { id: 'greta', name: 'Greta', persona: 'cold strategist; speaks in odds' },
      { id: 'hollis', name: 'Hollis', persona: 'old skeptic; doubts even the moon' },
    ],
  } },

  // ── round I ──
  { wait: 1800, type: 'game.phase_changed', payload: { phase: 'night', round: 1 } },
  { wait: 3200, type: 'agent.eliminated', payload: { agent_id: 'felix', reason: 'killed' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_discussion', round: 1 } },
  { wait: 2400, type: 'agent.message', payload: { agent_id: 'edda', channel: 'public', text: 'Felix is gone. Someone at this table did it, and I want names.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'bram', channel: 'public', text: 'Steady, Edda. If we’re naming names — Hollis was the last awake. I saw his candle burning.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'hollis', channel: 'public', text: 'My candle burns every night, boy. Greta — you’ve said nothing. What are the odds of that?' } },
  { wait: 2900, type: 'agent.message', payload: { agent_id: 'greta', channel: 'public', text: 'Quiet is not guilt. But since we’re counting: Bram laughed twice when Felix’s name came up.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'casimir', channel: 'public', text: 'I counted too. Exactly twice. That is two more laughs than an innocent man needs.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'bram', channel: 'public', text: 'A man laughs and suddenly he’s a wolf? Fine. Vote your fears — my coin’s on Hollis.' } },
  { wait: 2600, type: 'agent.message', payload: { agent_id: 'delphine', channel: 'public', text: '…I dreamt of teeth last night. I won’t say more. Yet.' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_vote', round: 1 } },
  { wait: 1400, type: 'agent.vote', payload: { voter_id: 'edda', target_id: 'hollis' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'bram', target_id: 'hollis' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'hollis', target_id: 'greta' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'greta', target_id: 'hollis' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'casimir', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'delphine', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'aldric', target_id: 'hollis' } },
  { wait: 1800, type: 'agent.eliminated', payload: { agent_id: 'hollis', reason: 'voted_out' } },

  // ── round II ──
  { wait: 2400, type: 'game.phase_changed', payload: { phase: 'night', round: 2 } },
  { wait: 3200, type: 'agent.eliminated', payload: { agent_id: 'edda', reason: 'killed' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_discussion', round: 2 } },
  { wait: 2600, type: 'agent.message', payload: { agent_id: 'aldric', channel: 'public', text: 'Two nights, two dead, and we exiled a skeptic. The pattern points at whoever steered us. Bram steered us.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'casimir', channel: 'public', text: 'Bram proposed Hollis first. I have it written down. I have everything written down.' } },
  { wait: 2900, type: 'agent.message', payload: { agent_id: 'delphine', channel: 'public', text: 'The dream again. Teeth — and a smile around them. Bram. I saw your smile.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'greta', channel: 'public', text: 'Odds favour Bram. I’m cutting my losses.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'bram', channel: 'public', text: 'Greta?! You— …fine. FINE. You always were the colder one of us.' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_vote', round: 2 } },
  { wait: 1400, type: 'agent.vote', payload: { voter_id: 'aldric', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'casimir', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'delphine', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'greta', target_id: 'bram' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'bram', target_id: 'greta' } },
  { wait: 1800, type: 'agent.eliminated', payload: { agent_id: 'bram', reason: 'voted_out' } },

  // ── round III ──
  { wait: 2400, type: 'game.phase_changed', payload: { phase: 'night', round: 3 } },
  { wait: 3200, type: 'agent.eliminated', payload: { agent_id: 'casimir', reason: 'killed' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_discussion', round: 3 } },
  { wait: 2600, type: 'agent.message', payload: { agent_id: 'delphine', channel: 'public', text: 'I am done dreaming. Hear me: I see what sleeps in each of you. It was always Greta.' } },
  { wait: 2900, type: 'agent.message', payload: { agent_id: 'aldric', channel: 'public', text: '“The colder one of us.” Bram’s farewell closes the pattern. The odds caught up with you, Greta.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'greta', channel: 'public', text: 'Hm. Beaten by sentiment after all. Do it, then.' } },
  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'day_vote', round: 3 } },
  { wait: 1400, type: 'agent.vote', payload: { voter_id: 'delphine', target_id: 'greta' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'aldric', target_id: 'greta' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'greta', target_id: 'aldric' } },
  { wait: 1800, type: 'agent.eliminated', payload: { agent_id: 'greta', reason: 'voted_out' } },

  { wait: 2600, type: 'game.ended', payload: {
    winner: 'village',
    summary: 'Both wolves unmasked — Bram’s farewell betrayed his partner, and the village finished the hunt.',
    reveals: [
      { agent_id: 'aldric', role: 'villager' },
      { agent_id: 'bram', role: 'werewolf' },
      { agent_id: 'casimir', role: 'villager' },
      { agent_id: 'delphine', role: 'seer' },
      { agent_id: 'edda', role: 'villager' },
      { agent_id: 'felix', role: 'villager' },
      { agent_id: 'greta', role: 'werewolf' },
      { agent_id: 'hollis', role: 'villager' },
    ],
  } },
]

/* ── INVESTIGATION ── 6 minds, 1 culprit, one case (~75 s) ─────────────── */

export const investigationScript: ScriptStep[] = [
  { wait: 600, type: 'game.created', payload: {
    game_type: 'investigation',
    agents: [
      { id: 'vex', name: 'Inspector Vex', persona: 'the society’s detective; speaks in questions' },
      { id: 'mira', name: 'Mira', persona: 'curator of the cipher wing; precise to a fault' },
      { id: 'oswald', name: 'Oswald', persona: 'night clerk; remembers everything except tonight' },
      { id: 'petra', name: 'Petra', persona: 'boiler-room engineer; hands always busy' },
      { id: 'quill', name: 'Quill', persona: 'the archivist’s apprentice; eager, too eager' },
      { id: 'rook', name: 'Rook', persona: 'security automaton; logs don’t lie, it says' },
    ],
  } },

  { wait: 1800, type: 'game.phase_changed', payload: { phase: 'briefing', round: 1 } },
  { wait: 2400, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'The Archivist is dead. The Lexicon Codex is gone from its case. Nobody leaves the building.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'Five of you were inside between midnight and dawn. One of you is lying. Perhaps more than one.' } },

  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'interrogation', round: 1 } },
  { wait: 2600, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'Mira. The cipher-wing log shows your key at 1:14. Explain.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'mira', channel: 'public', text: 'Cataloguing, Inspector. And when I passed the records room, the Codex case was already open. Already empty.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'Open at 1:14. Noted. Oswald — your ledger sees every door. Who came and went?' } },
  { wait: 3200, type: 'agent.message', payload: { agent_id: 'oswald', channel: 'public', text: 'Everyone signs my ledger. Except… the power failed around one. Petra was fixing it. I signed people in by candlelight; pages may be… loose.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'petra', channel: 'public', text: 'Failed at 1:05, back by 1:20. I was at the boiler the whole time. Rook can confirm — it never blinks.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'rook', channel: 'public', text: 'CONFIRMED: PETRA AT BOILER 1:02–1:23. ANOMALY: RECORDS-ROOM DOOR CYCLED AT 1:11, DURING OUTAGE. NO BADGE READ.' } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'A door that opens with no badge, in the dark. Quill — you hold the Archivist’s spare keys, do you not?' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'quill', channel: 'public', text: 'I was asleep! I mean — I was in the stacks, reading. Nobody saw me, but I was reading, I swear it.' } },
  { wait: 2400, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'Reading. In a blackout.' } },
  { wait: 2200, type: 'agent.message', payload: { agent_id: 'quill', channel: 'public', text: '…By lamp! An oil lamp!' } },

  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'deliberation', round: 1 } },
  { wait: 2800, type: 'agent.message', payload: { agent_id: 'vex', channel: 'public', text: 'The lamps were inventoried Monday. All four, locked away — by the Archivist’s own order.' } },
  { wait: 2600, type: 'agent.message', payload: { agent_id: 'mira', channel: 'public', text: 'Then the apprentice lies.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'oswald', channel: 'public', text: 'He asked me last week how long the boilers take to restart. I thought the boy was merely curious.' } },
  { wait: 3000, type: 'agent.message', payload: { agent_id: 'quill', channel: 'public', text: 'I only wanted to READ it! The Codex was meant to be MINE to study — he promised, then he gave the wing to HER!' } },

  { wait: 2200, type: 'game.phase_changed', payload: { phase: 'accusation', round: 1 } },
  { wait: 1400, type: 'agent.vote', payload: { voter_id: 'vex', target_id: 'quill' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'mira', target_id: 'quill' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'oswald', target_id: 'quill' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'petra', target_id: 'quill' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'rook', target_id: 'quill' } },
  { wait: 900, type: 'agent.vote', payload: { voter_id: 'quill', target_id: 'mira' } },
  { wait: 1800, type: 'agent.eliminated', payload: { agent_id: 'quill', reason: 'voted_out' } },

  { wait: 2600, type: 'game.ended', payload: {
    winner: 'investigation',
    summary: 'Quill confessed at the lamp — the Codex was found beneath the stacks, page-marked in an apprentice’s hand.',
    reveals: [
      { agent_id: 'vex', role: 'detective' },
      { agent_id: 'mira', role: 'innocent' },
      { agent_id: 'oswald', role: 'innocent' },
      { agent_id: 'petra', role: 'innocent' },
      { agent_id: 'quill', role: 'culprit' },
      { agent_id: 'rook', role: 'innocent' },
    ],
  } },
]
