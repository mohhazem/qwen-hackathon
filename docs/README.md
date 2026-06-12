# Docs

Documentation for the Agent Society project (Qwen Hackathon, Track 3).

Planned documents:

- `architecture.md` - system overview: backend engine, event bus, WebSocket streaming, frontend 3D viewer.
- `agents.md` - agent roles, prompts, and the negotiation / conflict-resolution protocols.
- `evaluation.md` - methodology and results for the multi-agent vs. single-agent baseline comparison.

## Games

1. **Werewolf** - social deduction. Agents take roles (werewolves, seer, doctor, villagers), discuss, accuse, negotiate, and vote across day/night phases.
2. **Investigation** - a detective case. Some agents are suspects (one is guilty and lies), others form an investigator team that divides tasks, shares findings, and negotiates an accusation.
