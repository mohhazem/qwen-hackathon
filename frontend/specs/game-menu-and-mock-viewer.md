# Spec — Game menu (poster wall) + mocked live game viewer

> Status: awaiting approval · Scope: **frontend only** · Date: 2026-06-13

## Goal

A lobby at `/` where the user picks **Werewolf** or **Investigation** and clicks PLAY.
Clicking creates a game and routes to `/games/{id}`, where a **scripted mock game plays
out live** (phases change, agents talk, votes happen, a winner is declared) — so the
product feels alive in demos before the Python engine exists.

Everything is shaped exactly like the real contract so that when the backend lands,
we swap the internals of two composables and delete the mock — no component changes.

## How FE ↔ BE work together (the target structure)

This is the contract from the root `CLAUDE.md`, spelled out as the load sequence:

```
 user clicks PLAY
        │
 1. REST: POST /api/games  { game_type: "werewolf" }
        │            ← backend replies { game_id: "abc123", ... }
 2. FE navigates to /games/abc123
        │
 3. FE opens WebSocket  ws://…/ws/games/abc123   (client-side only, one-way)
        │
 4. BE sends BACKFILL: every past event, seq 1..n   ← joining mid-game just works
 5. BE streams LIVE events as the engine runs the game loop
        │
 6. Pinia store folds each event into state (single reducer)
 7. Components (posters, panels, log, 3D later) only read store state
```

- **REST = commands** (create game). **WS = watching** (events, one-way server→client).
- Every fact is an event: `{ seq, game_id, type, ts, payload }`. The FE never fetches
  "current state" — it rebuilds it by folding events, including the backfill.
- On reconnect the FE sends its last seen `seq` and resumes from there.

**What we do now, frontend-only:** both backend touchpoints get mocked *behind their
real interface*:

| Touchpoint | Real (later) | Mock (this feature) |
|---|---|---|
| `useGamesApi.createGame()` | `POST {apiBase}/api/games` | generate a local id, return the same `GameSummary` shape |
| `useGameSocket(gameId)` | WebSocket + backfill + reconnect | scripted event timeline emitted on timers, same envelope, same dispatch into the store |

Components cannot tell the difference; the swap later is internal to those two files.

## Proposed event contract (FE-first)

Defined in `app/types/events.ts`. ⚠️ The backend's `app/events/schemas.py` does not
exist yet — whoever builds it must mirror these types (the "change both in one commit"
rule starts then).

Envelope: `{ seq: number, game_id: string, type: string, ts: string, payload: … }`

| type | payload |
|---|---|
| `game.created` | `{ game_type, agents: [{ id, name, persona }] }` |
| `game.phase_changed` | `{ phase, round }` — phases: werewolf `night / day_discussion / day_vote`; investigation `briefing / interrogation / deliberation / accusation` |
| `agent.message` | `{ agent_id, text, channel: "public" \| "private" }` |
| `agent.vote` | `{ voter_id, target_id }` |
| `agent.eliminated` | `{ agent_id, reason: "voted_out" \| "killed" }` |
| `game.ended` | `{ winner, summary, reveals: [{ agent_id, role }] }` |

Roles are only revealed in `game.ended` (hidden-role games — the stream is public info).

## Files

```
app/
  app.vue                          # shell: fonts, design tokens, grain overlay, <NuxtPage/>
  assets/css/main.css              # occult-society design system (CSS variables)
  types/events.ts                  # ⭐ proposed contract above
  types/game.ts                    # GameSummary, GameType, agent/phase types
  composables/useGamesApi.ts       # createGame() — mock now, REST later
  composables/useGameSocket.ts     # connect(gameId) — mock script now, WS later
  stores/game.ts                   # Pinia: single applyEvent() reducer + getters
  mocks/scripts.ts                 # the two scripted game timelines
  pages/index.vue                  # poster-wall lobby
  pages/games/[id].vue             # live viewer
  components/game/PhaseBanner.vue
  components/game/AgentCard.vue    # agent portrait/sigil + status (alive/eliminated/speaking)
  components/game/DialogueFeed.vue # agent.message stream, speech-bubble style
  components/game/EventLog.vue     # raw event ledger, mono, seq-stamped
  components/game/VerdictBanner.vue# game.ended overlay: winner + role reveals
```

New dependency: `@pinia/nuxt` (already planned in `frontend/CLAUDE.md`). No 3D yet —
TresJS arrives with a later feature; the viewer is 2D panels for now.

## Lobby — poster wall (`/`)

- Occult-society aesthetic: near-black warm ink, bone text, gold-leaf accents,
  engraved serif display (Cinzel) + IBM Plex Mono for system text, film-grain overlay.
- Centered `A G E N T  S O C I E T Y` masthead + tagline ("eight minds · hidden
  roles · one verdict"), small "Qwen Hackathon · Track 3" tag.
- Two large poster cards:
  - **WEREWOLF** — moonlit night: deep blue-black, glowing moon, silhouetted pines.
  - **INVESTIGATION** — noir: amber venetian-blind light slats, long shadows.
- Hover: poster lifts/tilts, its scene brightens. Click PLAY → button becomes
  "CONVENING AGENTS…" (~1s staged delay so the mock doesn't feel instant) → navigate.

## Viewer (`/games/[id]`)

- Unknown id → "no such session" state with a return-to-lobby link.
- Themed by game type (werewolf = cold moonlight, investigation = amber noir).
- Layout: phase banner across the top (phase + round + day/night iconography);
  agent roster down one side (cards dim when eliminated, glow when speaking);
  dialogue feed center; collapsible raw event log (mono ledger) on the other side.
- `agent.vote` events render a live tally during vote phases.
- `game.ended` → verdict overlay: winner, role reveals, REPLAY and RETURN TO LOBBY.
- Mock pacing: events ~1.5–3 s apart; Werewolf script ≈ 2 rounds (~90 s), Investigation
  one case (~75 s). Scripts live in `app/mocks/scripts.ts`, one per game type.

## Rules honored (from CLAUDE.md)

- Components never see raw events' source — `useGameSocket` is the only emitter,
  `stores/game.ts#applyEvent` the only reducer. State is a fold of events.
- Mock "socket" starts client-side only (`onMounted`) — SSR-safe.
- Game creation goes through the games-api composable (REST-shaped), never the socket.

## Known mock limitations (accepted)

- Refreshing `/games/{id}` restarts the script from seq 1 (a real backend would
  backfill to the live position; the mock has no server to remember progress).
- Game list/rejoin in the lobby is omitted — meaningless without persistence.

## Acceptance criteria

1. `npm run dev` → `/` shows the poster wall; no backend running, no console errors.
2. Click PLAY on Werewolf → `/games/{id}` → scripted game plays through: phases
   rotate, agents talk, votes tally, eliminations dim agents, verdict overlay appears.
3. Investigation does the same with its own script, phases, and noir theme.
4. Direct visit to `/games/nonsense` → graceful "no such session" state.
5. All state visible in components comes from the Pinia store's event fold.
