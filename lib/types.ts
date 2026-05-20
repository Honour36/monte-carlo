export type Car = {
  id: string;
  name: string;
  color: string;
  baseSpeed: number;
  acceleration: number;
  skill: number;
  degradation: number;
};

export type RaceResult = {
  carId: string;
  rank: number;
  finishTime: number | null;
  dnf: boolean;
  distance: number;
};

export type RaceSeriesPoint = {
  t: number;
  positions: Record<string, number>;
  velocities: Record<string, number>;
};

export type RaceData = {
  series: RaceSeriesPoint[];
  results: RaceResult[];
};

export type MonteCarloCarStats = {
  carId: string;
  wins: number;
  winPct: number;
  avgFinishTime: number | null;
  dnfCount: number;
};

export type MonteCarloData = {
  stats: MonteCarloCarStats[];
  winProbabilities: { carId: string; name: string; color: string; probability: number }[];
};
