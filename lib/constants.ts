import type { Car } from "./types";

export const TRACK_LENGTH = 5000;
export const TOTAL_TIME = 60;
export const DT = 0.05;
export const MC_RUNS = 5000;

export const DEFAULT_CARS: Car[] = [
  {
    id: "apex",
    name: "Apex Predator",
    color: "#f97316",
    baseSpeed: 95,
    acceleration: 4.2,
    skill: 0.88,
    degradation: 0.12,
  },
  {
    id: "rocket",
    name: "Rocket Boy",
    color: "#22d3ee",
    baseSpeed: 102,
    acceleration: 5.8,
    skill: 0.55,
    degradation: 0.35,
  },
  {
    id: "steady",
    name: "Steady Cruiser",
    color: "#a78bfa",
    baseSpeed: 82,
    acceleration: 3.1,
    skill: 0.92,
    degradation: 0.08,
  },
];
