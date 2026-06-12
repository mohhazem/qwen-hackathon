# Frontend — Nuxt game viewer

Nuxt 4 app that watches games running on the Python backend: a 3D viewer plus agent
dialogue panels, driven entirely by the real-time event stream. See the root
`CLAUDE.md` for the cross-cutting event contract.

> Status: boilerplate (`app/app.vue` only). The layout below is the **target** —
> create directories as features land.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
```

The backend must be running at `http://127.0.0.1:8000` (configured via
`runtimeConfig.public.apiBase` in `nuxt.config.ts`).

## Target layout (`app/`)

```
pages/index.vue              # lobby: create / pick a game
pages/games/[id].vue         # live game viewer
composables/useGameSocket.ts # WS connect, reconnect with last seq, dispatch to store
stores/game.ts               # Pinia: state rebuilt by folding events (single reducer)
types/events.ts              # ⭐ TS mirror of the backend event contract
components/game/             # shared: EventLog, AgentDialoguePanel, PhaseBanner
components/werewolf/         # 3D scene + werewolf-specific UI
components/investigation/    # 3D scene + investigation-specific UI
```

## Rules

- **Components never handle raw WS messages.** `useGameSocket` is the only place that
  touches the WebSocket; it feeds events into the game store's single event handler.
  Components — including 3D scenes — only read reactive store state.
- Frontend state is a fold of events. Don't fetch "current state" separately; a client
  joining mid-game gets an event backfill over the WS and rebuilds from it.
- `types/events.ts` mirrors `backend/app/events/schemas.py`. **If you change one,
  change the other in the same commit.**
- Game control (create game, etc.) goes over REST to the backend; the WS is one-way
  server → client. Don't send input over the socket.

## Gotchas

- This is Nuxt 4: app code lives under `app/`, not at the package root.
- Nuxt is SSR by default — only open the WebSocket client-side (`import.meta.client`
  guard or `onMounted`). Build the WS URL from `apiBase` (swap `http` → `ws`).
- Planned deps when needed (not yet installed): `@pinia/nuxt` (store),
  `@tresjs/nuxt` (3D scenes).
- Windows dev machine: keep `127.0.0.1` (not `localhost`) for the backend URL.
