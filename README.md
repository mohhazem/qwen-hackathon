# Agent Society — Qwen Hackathon (Track 3)

A multi-agent collaboration system where agents with distinct roles work together — and against each other — through task division, dialogue, and negotiation, visualized as 3D games you can watch live.

**Track 3: Agent Society** — showcasing how agents decompose tasks and assign roles, how they resolve disagreements and execution conflicts, and a measurable efficiency gain over single-agent baselines.

## The games

1. **Werewolf** — social deduction. Agents are dealt hidden roles (werewolves, seer, doctor, villagers) and must discuss, accuse, defend, and vote across day/night phases.
2. **Investigation** — a detective case. Suspect agents (one guilty, and lying about it) are questioned by an investigator team that divides tasks, shares findings, and negotiates the final accusation.

> **Status:** hello-world boilerplate. The structure below runs end-to-end; the games come next.

## Project structure

```
backend/    Python (FastAPI) — game engine, agents, WebSocket event stream
frontend/   Nuxt — 3D game viewer and agent dialogue panels
docs/       Architecture, agent design, and evaluation docs
```

## Prerequisites

- Python 3.11+
- Node.js 20+

## Running the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is now at http://127.0.0.1:8000 — try http://127.0.0.1:8000/api/hello

## Running the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — the page says hello and shows the message it fetched from the backend, confirming the two are wired together.

## Configuration

Copy `backend/.env.example` to `backend/.env`. A Qwen API key is not needed for the boilerplate; it will power the agents once the games are implemented.
