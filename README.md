# Monte Carlo Race Simulator

Browser-based race simulation with stochastic dynamics and Monte Carlo win-rate analysis. Built with Next.js and Recharts.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

This repo is ready for Vercel with zero extra configuration.

### Option A — Import from GitHub (recommended)

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New… → Project**.
3. Import **`Honour36/monte-carlo`**.
4. Leave defaults:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (repository root)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** (leave empty — Next.js handles this)
5. Click **Deploy**.

No environment variables are required. The app runs entirely in the browser.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Run production build     |
| `npm run lint` | ESLint                   |

## Project layout

- `app/` — Next.js UI (`RaceSimulator` client component)
- `lib/` — Pure simulation engine (`simulateRace`, `runMonteCarlo`)
- `context/` — Project specs and conventions
