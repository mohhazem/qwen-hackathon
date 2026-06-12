# Agent Society — Qwen Hackathon (Track 3)

Multi-agent games (Werewolf, Investigation) where LLM agents with hidden roles discuss,
negotiate, and vote. The Python backend runs the games; the Nuxt frontend watches them
live as a 3D viewer with agent dialogue panels.

Directory-specific instructions live in `backend/CLAUDE.md` and `frontend/CLAUDE.md`.
This file holds only what spans both halves.

## Architecture

A small event-sourced pipeline:

```
engine (game loop, agents)  →  event bus  →  WebSocket broadcast  →  Pinia store  →  components
        emits events            in-process       /ws/games/{id}        folds events     read state
```

**REST for commands, WebSocket for watching.** Clients create/control games over REST
(`POST /api/games` → `game_id`), then watch via a one-way WS stream.

## The event contract (most important rule)

Every fact the frontend displays is an event with this envelope:

```json
{ "seq": 42, "game_id": "...", "type": "agent.message", "ts": "...", "payload": { ... } }
```

- `seq` increases monotonically per game; the backend keeps full event history.
- A client connecting mid-game receives a backfill of all past events, then live ones.
  Reconnects send their last seen `seq` and resume from there.
- Event types are namespaced strings: `game.created`, `game.phase_changed`,
  `agent.message`, `agent.vote`, `game.ended`, etc.
- The contract is defined in exactly two mirrored files:
  - `backend/app/events/schemas.py` — Pydantic discriminated union on `type`
  - `frontend/app/types/events.ts` — TypeScript mirror
  - **If you change one, change the other in the same commit.**
