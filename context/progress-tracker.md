# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Complete — v1 delivered as Next.js app.

## Current Goal

Ready for presentation. No active development unit.

## Completed

- Stochastic simulation engine (`simulateRace`) with LCG seeded RNG,
  deterministic acceleration model, tire degradation, and Brownian noise scaled
  by √dt
- Monte Carlo runner (`runMonteCarlo`) — 5,000 races, win/DNF tallies,
  average finish time per car
- Dark dashboard layout — fixed sidebar, scrollable main, header with
  simulation constants display
- Car configuration sidebar — sliders for base speed, acceleration, driver
  skill, tire degradation; editable car name; per-car color accent
- Race tab — position-over-time chart, velocity-over-time chart, finish result
  cards with rank medals and finish times
- Monte Carlo tab — win probability bar chart, full stats table sorted by wins
- Three default car archetypes: Apex Predator, Rocket Boy, Steady Cruiser
- All context files authored: project-overview, architecture, ui-context,
  code-standards, ai-workflow-rules, progress-tracker
- Next.js port: `lib/simulation.ts`, `lib/constants.ts`, `lib/types.ts`,
  `app/components/RaceSimulator.tsx`, Recharts, DM Mono font

## In Progress

- Nothing.

## Next Up (Extension Ideas — not committed)

- Pit stop strategy: if velocity drops below 80% of initial max, trigger a
  3s speed-zero penalty and reset degradation clock
- Fourth car slot with user-defined name and color picker
- Export chart as PNG for slide embedding
- Adjustable track length and simulation duration via sidebar inputs
- Distribution histogram of finish times from Monte Carlo run

## Open Questions

- Should Monte Carlo run count be user-adjustable (slider from 1k to 50k)?
  Currently hardcoded at 5,000 for presentation speed.
- Should the velocity chart be hidden by default to reduce visual noise during
  a live demo?

## Architecture Decisions

- **Next.js app (was single-file artifact)**: Project bootstrapped with
  `create-next-app`; simulation logic stays pure in `lib/`, UI in client
  component. Enables `npm run dev` and production build for presentations.
- **LCG RNG over Math.random()**: Enables reproducible per-seed races needed
  for Monte Carlo determinism. `Math.imul` used for correct 32-bit overflow.
- **setTimeout(..., 50) wrapper**: Lets React flush the "running" button state
  before the synchronous simulation blocks the JS thread. Without it the button
  never visually updates to "SIMULATING...".
- **Pure simulation functions**: `simulateRace` and `runMonteCarlo` have no
  React dependencies. This makes them trivially portable to a Web Worker or
  Node.js if performance becomes a constraint.

## Session Notes

- Run locally: `npm run dev` → http://localhost:3000
- To resume: pick an extension from "Next Up", add it as the current goal here,
  implement it, then update this file.
