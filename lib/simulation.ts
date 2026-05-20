import { DT, MC_RUNS, TOTAL_TIME, TRACK_LENGTH } from "./constants";
import type { Car, MonteCarloData, RaceData, RaceResult } from "./types";

function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function raceSeed(baseSeed: number, carIndex: number): number {
  return Math.imul(baseSeed, Math.imul(carIndex + 1, 2654435761)) >>> 0;
}

function monteCarloSeed(runIndex: number): number {
  return Math.imul(runIndex + 1, 92837111) >>> 0;
}

type CarRunState = {
  carId: string;
  position: number;
  velocity: number;
  finished: boolean;
  finishTime: number | null;
};

export function simulateRace(cars: Car[], seed: number): RaceData {
  const steps = Math.ceil(TOTAL_TIME / DT) + 1;
  const series: RaceData["series"] = [];
  const states: CarRunState[] = cars.map((car) => ({
    carId: car.id,
    position: 0,
    velocity: car.baseSpeed * 0.15,
    finished: false,
    finishTime: null,
  }));
  const rngs = cars.map((_, index) => createRng(raceSeed(seed, index)));

  for (let step = 0; step < steps; step += 1) {
    const t = step * DT;
    const point: RaceData["series"][number] = {
      t,
      positions: {},
      velocities: {},
    };

    for (let i = 0; i < cars.length; i += 1) {
      const car = cars[i];
      const state = states[i];

      point.positions[car.id] = state.position;
      point.velocities[car.id] = state.velocity;

      if (state.finished || t >= TOTAL_TIME) continue;

      const degradationFactor =
        1 - car.degradation * Math.min(1, t / TOTAL_TIME);
      const maxSpeed = car.baseSpeed * degradationFactor;
      const accelForce = car.acceleration * (maxSpeed - state.velocity);
      const noiseSigma = 8 * (1 - car.skill * 0.85);
      const dV =
        accelForce * DT + noiseSigma * Math.sqrt(DT) * gaussian(rngs[i]);

      state.velocity = Math.max(0, state.velocity + dV);
      state.position += state.velocity * DT;

      if (state.position >= TRACK_LENGTH) {
        state.finished = true;
        state.finishTime = t;
        state.position = TRACK_LENGTH;
      }
    }

    series.push(point);
    if (states.every((s) => s.finished)) break;
  }

  const results: RaceResult[] = cars
    .map((car) => {
      const state = states.find((s) => s.carId === car.id)!;
      return {
        carId: car.id,
        rank: 0,
        finishTime: state.finishTime,
        dnf: !state.finished,
        distance: state.position,
      };
    })
    .sort((a, b) => {
      if (a.dnf !== b.dnf) return a.dnf ? 1 : -1;
      if (a.dnf && b.dnf) return b.distance - a.distance;
      return (a.finishTime ?? Infinity) - (b.finishTime ?? Infinity);
    })
    .map((result, index) => ({ ...result, rank: index + 1 }));

  return { series, results };
}

export function runMonteCarlo(cars: Car[]): MonteCarloData {
  const tallies = new Map(
    cars.map((car) => [
      car.id,
      { wins: 0, dnfCount: 0, finishTimes: [] as number[] },
    ]),
  );

  for (let run = 0; run < MC_RUNS; run += 1) {
    const { results } = simulateRace(cars, monteCarloSeed(run));
    const winner = results.find((r) => r.rank === 1);
    if (!winner) continue;

    const winnerStats = tallies.get(winner.carId)!;
    winnerStats.wins += 1;

    for (const result of results) {
      const stats = tallies.get(result.carId)!;
      if (result.dnf) {
        stats.dnfCount += 1;
      } else if (result.finishTime !== null) {
        stats.finishTimes.push(result.finishTime);
      }
    }
  }

  const stats = cars
    .map((car) => {
      const entry = tallies.get(car.id)!;
      const avgFinishTime =
        entry.finishTimes.length > 0
          ? entry.finishTimes.reduce((sum, t) => sum + t, 0) /
            entry.finishTimes.length
          : null;
      return {
        carId: car.id,
        wins: entry.wins,
        winPct: (entry.wins / MC_RUNS) * 100,
        avgFinishTime,
        dnfCount: entry.dnfCount,
      };
    })
    .sort((a, b) => b.wins - a.wins);

  const winProbabilities = cars.map((car) => {
    const carStats = stats.find((s) => s.carId === car.id)!;
    return {
      carId: car.id,
      name: car.name,
      color: car.color,
      probability: carStats.winPct,
    };
  });

  return { stats, winProbabilities };
}
