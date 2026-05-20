# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. The context
files define what to build, how to build it, and the current state of progress.
Always implement against these specs — do not infer or invent behavior from
scratch. The entire app lives in a single `race-sim.jsx` file (React artifact,
no build step). Every change is a direct edit to that file.

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated concerns in a single implementation step
- Each unit must be verifiable by running the artifact and checking the outcome
  described in the relevant success criterion

## When to Split Work

Split an implementation step if it combines:

- Simulation logic changes and UI changes at the same time
- Chart rendering and data pipeline changes in the same edit
- Multiple unrelated UI sections (e.g. sidebar + results table + Monte Carlo tab)
- Any change whose correctness cannot be checked by visual inspection of the
  artifact in under 30 seconds

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before
  implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md`
  before continuing

## Protected Areas

Do not modify the following unless explicitly instructed:

- The LCG RNG implementation inside `simulateRace()` — changing it breaks
  reproducibility
- `DEFAULT_CARS` car colors — they are the visual identity anchor for all charts
- Simulation constants (`TRACK_LENGTH`, `TOTAL_TIME`, `DT`, `MC_RUNS`) — changes
  here affect all downstream results and need explicit sign-off

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- A new component is added → update `code-standards.md` file organisation
- A new color is introduced → add it to `ui-context.md`
- A new simulation parameter is added → update `architecture.md` invariants
  if it affects purity or state ownership

## Before Moving to the Next Unit

1. The artifact renders without errors in the browser
2. The changed feature works end to end (run the relevant user flow manually)
3. No invariant defined in `architecture.md` was violated
4. `progress-tracker.md` reflects the completed work and any decisions made
