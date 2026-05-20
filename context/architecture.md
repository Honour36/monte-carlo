# Architecture Context

## Stack

| Layer       | Technology              | Role                                      |
| ----------- | ----------------------- | ----------------------------------------- |
| Framework   | Next.js 16 + React      | UI rendering and state management         |
| Charts      | Recharts                | Line charts, bar charts, reference lines  |
| Styling     | Inline CSS + CSS vars   | Dark theme, component-level scoping       |
| Simulation  | Pure TypeScript (`lib/`) | SDE engine, Monte Carlo runner           |
| Runtime     | Browser only            | Client-side; no API or persistence        |

## System Boundaries

- `SimulationCore` — `simulateRace()` and `runMonteCarlo()` are pure functions
  with no side effects. They take car config + simulation constants and return
  plain data arrays. They never touch React state directly.
- `CarPanel` — owns per-car parameter UI. Calls `onChange` with a full updated
  car object; never mutates shared state itself.
- `App` — owns all simulation state (`raceData`, `mcData`, `cars`). Is the only
  place `simulateRace` and `runMonteCarlo` are called.
- `Charts` — receive pre-computed data arrays as props only. No simulation logic
  inside chart components.

## Storage Model

- **React state only**: All car configs and simulation results live in `useState`.
  Nothing is persisted to localStorage, a database, or any external service.
- **No backend**: The app is entirely client-side. There is no API layer.

## Auth and Access Model

- No authentication. The app is a single anonymous session.
- No ownership model — all state is ephemeral and local to the browser tab.

## Invariants

1. `simulateRace()` and `runMonteCarlo()` must remain pure functions — no
   React imports, no global mutations, no side effects.
2. Chart components must never call simulation functions. They receive data as props.
3. All simulation constants (`TRACK_LENGTH`, `TOTAL_TIME`, `DT`, `MC_RUNS`) are
   defined once at module level and never duplicated inline.
4. Car color is the single source of truth for each car's visual identity —
   used identically in sidebar, charts, cards, and tables.
5. The `setTimeout(..., 50)` wrapper around simulation calls exists to allow
   React to flush the "running" state before the synchronous simulation blocks
   the thread. Do not remove it.
