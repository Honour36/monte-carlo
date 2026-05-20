# Code Standards

## General

- Keep modules small and single-purpose — simulation logic, UI components,
  and chart wrappers are separate concerns
- Fix root causes, do not layer workarounds — if a chart flickers, fix the
  data pipeline, not the render
- Do not mix simulation logic with rendering logic in the same function

## React

- All state lives in `App` — child components receive props and call callbacks
- Use `useCallback` for functions passed as props to avoid unnecessary re-renders
- Never call `simulateRace` or `runMonteCarlo` inside a render function —
  only inside event handlers or effects
- `isAnimationActive={false}` is required on all Recharts `<Line>` components —
  animation causes visual glitches when datasets are large
- Never use `useEffect` to trigger a simulation on mount — simulations are
  always user-initiated

## JavaScript / Simulation

- `simulateRace()` and `runMonteCarlo()` must be pure functions — same inputs
  always produce same outputs for a given seed
- The LCG RNG inside `simulateRace` must use `Math.imul` for 32-bit integer
  overflow behaviour — do not replace with `Math.random()`
- Seed values for Monte Carlo runs must be deterministic functions of the run
  index and car index — never use `Date.now()` as a seed component
- All simulation constants are defined at module level — never inline magic numbers

## Styling

- All colors come from the token table in `ui-context.md` — no hardcoded hex
  values except in `DEFAULT_CARS` (car accent colors) and the `ui-context.md`
  token definitions themselves
- All inline `style` props use plain objects — no template strings for styles
- Border radius follows the scale in `ui-context.md` — do not introduce new values

## Recharts

- Always wrap charts in `<ResponsiveContainer width="100%" height={N}>`
- Always set `margin={{ top: 8, right: 16, bottom: 8, left: 0 }}` on chart roots
  to prevent label clipping
- Use a custom `<Tooltip content={...}>` — never use the default Recharts tooltip
  (it does not respect the dark theme)
- `<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />` on every chart

## File Organisation

- `lib/simulation.ts` — `simulateRace`, `runMonteCarlo` (pure, no React)
- `lib/constants.ts` — `TRACK_LENGTH`, `TOTAL_TIME`, `DT`, `MC_RUNS`, `DEFAULT_CARS`
- `lib/types.ts` — `Car`, `RaceData`, `MonteCarloData`, etc.
- `app/components/RaceSimulator.tsx` — client UI (`CarPanel`, charts, tabs, state)
- `app/page.tsx` — renders `RaceSimulator`
