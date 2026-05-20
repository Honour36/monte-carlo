# Stochastic Race Simulator

## Overview

A browser-based computational modelling tool that simulates Formula-style
race cars using Stochastic Differential Equations (SDEs) and Brownian motion.
Built for academic presentations, it lets users configure car parameters,
run a single race to see probabilistic position/velocity curves, and run a
Monte Carlo analysis across thousands of races to derive win probabilities.

## Goals

1. Make SDE and Brownian motion concepts tangible through interactive visualisation
2. Let users explore how parameter choices (skill, degradation, speed) affect race outcomes
3. Deliver a polished, presentation-ready dashboard that runs entirely in the browser

## Core User Flow

1. User opens the app and sees three pre-configured car archetypes in the sidebar
2. User adjusts any car's parameters via sliders (top speed, acceleration, skill, degradation)
3. User clicks "Run Race" — simulation runs and position + velocity charts render
4. User reads the finish result cards (rank, finish time, or DNF)
5. User clicks "Monte Carlo" — 5,000 races run and win probability chart + stats table render
6. User tweaks parameters and re-runs to compare outcomes

## Features

### Race Simulation
- Per-car sliders: base speed, acceleration, driver skill, tire degradation
- Position-over-time chart with finish line reference
- Velocity-over-time chart showing noise and degradation effects
- Finish result cards with rank, medal, and finish time (or DNF + distance)

### Monte Carlo Analysis
- Runs 5,000 independent races with varied random seeds
- Win probability bar chart per car
- Stats table: wins, win %, average finish time, DNF count

### Car Configuration
- Three default archetypes: Apex Predator, Rocket Boy, Steady Cruiser
- Editable car names inline
- Each car has a distinct accent color used consistently across all charts

## Scope

### In Scope
- Single-page React app (JSX artifact — no build step required)
- Client-side simulation only — no server, no persistence
- Three cars maximum (presentation constraint)
- Two tabs: Race Simulation and Monte Carlo Analysis

### Out of Scope
- User authentication or saved sessions
- Adding or removing cars dynamically
- Backend API or database
- Mobile-optimised layout
- Pit stop strategy simulation (extension idea, not in v1)

## Success Criteria

1. "Run Race" renders position and velocity charts in under 200ms
2. "Monte Carlo" completes 5,000 races and renders results in under 2s
3. Changing any slider and re-running produces a visibly different chart
4. All three cars render with correct colors across charts, cards, and tables
5. App loads with zero external dependencies beyond Recharts
