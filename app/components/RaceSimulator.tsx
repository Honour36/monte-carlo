"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DEFAULT_CARS, DT, MC_RUNS, TOTAL_TIME, TRACK_LENGTH } from "@/lib/constants";
import { runMonteCarlo, simulateRace } from "@/lib/simulation";
import type { Car, MonteCarloData, RaceData } from "@/lib/types";

const tokens = {
  bgBase: "#020817",
  bgSurface: "#0f172a",
  bgElevated: "#1e293b",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textSubtle: "#475569",
  accentPrimary: "#f97316",
  borderDefault: "#1e293b",
  borderEmphasis: "#334155",
  stateError: "#ef4444",
} as const;

type Tab = "race" | "monte";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: tokens.textSecondary,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function ChartBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: tokens.bgSurface,
        border: `1px solid ${tokens.borderDefault}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: tokens.textSecondary,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p
      style={{
        margin: "32px 0",
        color: tokens.textMuted,
        fontSize: 14,
      }}
    >
      {message}
    </p>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: tokens.textSecondary,
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ color: tokens.textPrimary }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: tokens.accentPrimary }}
      />
    </div>
  );
}

function CarPanel({
  car,
  onChange,
}: {
  car: Car;
  onChange: (car: Car) => void;
}) {
  const update = (patch: Partial<Car>) => onChange({ ...car, ...patch });

  return (
    <div
      style={{
        background: tokens.bgSurface,
        border: `1px solid ${tokens.borderDefault}`,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: car.color,
            flexShrink: 0,
          }}
        />
        <input
          value={car.name}
          onChange={(e) => update({ name: e.target.value })}
          style={{
            flex: 1,
            background: tokens.bgElevated,
            border: `1px solid ${tokens.borderEmphasis}`,
            borderRadius: 4,
            color: tokens.textPrimary,
            fontSize: 13,
            padding: "6px 8px",
          }}
        />
      </div>
      <Slider
        label="Top speed"
        value={car.baseSpeed}
        min={60}
        max={120}
        step={1}
        onChange={(baseSpeed) => update({ baseSpeed })}
      />
      <Slider
        label="Acceleration"
        value={car.acceleration}
        min={1}
        max={8}
        step={0.1}
        onChange={(acceleration) => update({ acceleration })}
      />
      <Slider
        label="Driver skill"
        value={car.skill}
        min={0.3}
        max={1}
        step={0.01}
        onChange={(skill) => update({ skill })}
      />
      <Slider
        label="Tire degradation"
        value={car.degradation}
        min={0.05}
        max={0.5}
        step={0.01}
        onChange={(degradation) => update({ degradation })}
      />
    </div>
  );
}

function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: tokens.bgElevated,
        border: `1px solid ${tokens.borderEmphasis}`,
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 11,
      }}
    >
      <div style={{ color: tokens.textMuted, marginBottom: 4 }}>t = {label}s</div>
      {payload.map((entry) => (
        <div key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(1)}
        </div>
      ))}
    </div>
  );
}

function ResultCard({
  car,
  result,
}: {
  car: Car;
  result: RaceData["results"][number];
}) {
  return (
    <div
      style={{
        background: tokens.bgSurface,
        border: `1px solid ${tokens.borderDefault}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: car.color, fontWeight: 600, fontSize: 15 }}>{car.name}</span>
      </div>
      <div style={{ fontSize: 13, color: tokens.textMuted }}>
        {result.rank === 1 ? "1st" : result.rank === 2 ? "2nd" : result.rank === 3 ? "3rd" : `${result.rank}th`}
      </div>
      {result.dnf ? (
        <div style={{ marginTop: 8, color: tokens.stateError, fontSize: 13 }}>
          DNF — {result.distance.toFixed(0)}m reached
        </div>
      ) : (
        <div style={{ marginTop: 8, color: tokens.textPrimary, fontSize: 13 }}>
          Finish: {result.finishTime?.toFixed(2)}s
        </div>
      )}
    </div>
  );
}

export default function RaceSimulator() {
  const [cars, setCars] = useState<Car[]>(() =>
    DEFAULT_CARS.map((c) => ({ ...c })),
  );
  const [tab, setTab] = useState<Tab>("race");
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [mcData, setMcData] = useState<MonteCarloData | null>(null);
  const [running, setRunning] = useState(false);

  const updateCar = useCallback((index: number, car: Car) => {
    setCars((prev) => prev.map((c, i) => (i === index ? car : c)));
  }, []);

  const runRace = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      setRaceData(simulateRace(cars, 42));
      setRunning(false);
    }, 50);
  }, [cars]);

  const runMc = useCallback(() => {
    setRunning(true);
    setTab("monte");
    setTimeout(() => {
      setMcData(runMonteCarlo(cars));
      setRunning(false);
    }, 50);
  }, [cars]);

  const chartRows = useMemo(() => {
    if (!raceData) return [];
    return raceData.series.map((point) => {
      const row: Record<string, number> = { t: point.t };
      for (const car of cars) {
        row[`${car.id}_pos`] = point.positions[car.id] ?? 0;
        row[`${car.id}_vel`] = point.velocities[car.id] ?? 0;
      }
      return row;
    });
  }, [raceData, cars]);

  const mcBarData = useMemo(
    () =>
      mcData?.winProbabilities.map((entry) => ({
        name: entry.name,
        probability: entry.probability,
        fill: entry.color,
      })) ?? [],
    [mcData],
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: tokens.bgBase,
        color: tokens.textPrimary,
      }}
    >
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          borderRight: `1px solid ${tokens.borderDefault}`,
          padding: 20,
          overflowY: "auto",
          background: tokens.bgBase,
        }}
      >
        <SectionLabel>Cars</SectionLabel>
        {cars.map((car, index) => (
          <CarPanel key={car.id} car={car} onChange={(c) => updateCar(index, c)} />
        ))}
        <button
          type="button"
          onClick={runRace}
          disabled={running}
          style={{
            width: "100%",
            padding: "10px 14px",
            marginBottom: 8,
            borderRadius: 6,
            border: "none",
            background: tokens.accentPrimary,
            color: tokens.bgBase,
            fontWeight: 500,
            fontSize: 13,
            cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running…" : "Run race"}
        </button>
        <button
          type="button"
          onClick={runMc}
          disabled={running}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 6,
            border: `1px solid ${tokens.borderEmphasis}`,
            background: tokens.bgElevated,
            color: tokens.textPrimary,
            fontSize: 13,
            cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running…" : "Monte Carlo"}
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: `1px solid ${tokens.borderDefault}`,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Race simulator</h1>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: tokens.textMuted,
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            }}
          >
            {TRACK_LENGTH} m track, {TOTAL_TIME} s, dt {DT}, {MC_RUNS.toLocaleString()} runs
          </p>
        </header>

        <div
          style={{
            display: "flex",
            gap: 0,
            padding: "0 24px",
            borderBottom: `1px solid ${tokens.borderDefault}`,
          }}
        >
          {(
            [
              ["race", "Race"],
              ["monte", "Monte Carlo"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                borderBottom:
                  tab === id
                    ? `2px solid ${tokens.accentPrimary}`
                    : "2px solid transparent",
                color: tab === id ? tokens.textPrimary : tokens.textMuted,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {tab === "race" && (
            <>
              {!raceData ? (
                <EmptyState message="Run a race to see charts and results." />
              ) : (
                <>
                  <ChartBox title="Position">
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart
                        data={chartRows}
                        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={tokens.borderDefault} />
                        <XAxis
                          dataKey="t"
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                          label={{
                            value: "Time (s)",
                            position: "insideBottom",
                            offset: -4,
                            fill: tokens.textMuted,
                            fontSize: 10,
                          }}
                        />
                        <YAxis
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                        />
                        <Tooltip content={<DarkTooltip />} />
                        <ReferenceLine
                          y={TRACK_LENGTH}
                          stroke={tokens.textSubtle}
                          strokeDasharray="4 4"
                          label={{
                            value: "Finish",
                            fill: tokens.textMuted,
                            fontSize: 10,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {cars.map((car) => (
                          <Line
                            key={car.id}
                            type="monotone"
                            dataKey={`${car.id}_pos`}
                            name={car.name}
                            stroke={car.color}
                            dot={false}
                            strokeWidth={2}
                            isAnimationActive={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartBox>

                  <ChartBox title="Velocity">
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart
                        data={chartRows}
                        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={tokens.borderDefault} />
                        <XAxis
                          dataKey="t"
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                        />
                        <YAxis
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                        />
                        <Tooltip content={<DarkTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {cars.map((car) => (
                          <Line
                            key={car.id}
                            type="monotone"
                            dataKey={`${car.id}_vel`}
                            name={car.name}
                            stroke={car.color}
                            dot={false}
                            strokeWidth={2}
                            isAnimationActive={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartBox>

                  <SectionLabel>Results</SectionLabel>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                    }}
                  >
                    {raceData.results.map((result) => {
                      const car = cars.find((c) => c.id === result.carId)!;
                      return (
                        <ResultCard key={result.carId} car={car} result={result} />
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {tab === "monte" && (
            <>
              {!mcData ? (
                <EmptyState message="Run Monte Carlo to see win rates and summary stats." />
              ) : (
                <>
                  <ChartBox title="Win rate">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={mcBarData}
                        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={tokens.borderDefault} />
                        <XAxis
                          dataKey="name"
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                        />
                        <YAxis
                          stroke={tokens.textMuted}
                          tick={{ fill: tokens.textMuted, fontSize: 10 }}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            return (
                              <div
                                style={{
                                  background: tokens.bgElevated,
                                  border: `1px solid ${tokens.borderEmphasis}`,
                                  borderRadius: 6,
                                  padding: "8px 12px",
                                  fontSize: 11,
                                  color: tokens.textPrimary,
                                }}
                              >
                                {Number(payload[0].value).toFixed(1)}% win rate
                              </div>
                            );
                          }}
                        />
                        <Bar dataKey="probability" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                          {mcBarData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartBox>

                  <ChartBox title="Summary">
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ color: tokens.textMuted, textAlign: "left" }}>
                          <th style={{ padding: "8px 12px" }}>Car</th>
                          <th style={{ padding: "8px 12px" }}>Wins</th>
                          <th style={{ padding: "8px 12px" }}>Win %</th>
                          <th style={{ padding: "8px 12px" }}>Avg finish (s)</th>
                          <th style={{ padding: "8px 12px" }}>DNFs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mcData.stats.map((row) => {
                          const car = cars.find((c) => c.id === row.carId)!;
                          return (
                            <tr
                              key={row.carId}
                              style={{ borderTop: `1px solid ${tokens.borderDefault}` }}
                            >
                              <td style={{ padding: "10px 12px", color: car.color }}>
                                {car.name}
                              </td>
                              <td style={{ padding: "10px 12px" }}>{row.wins}</td>
                              <td style={{ padding: "10px 12px" }}>
                                {row.winPct.toFixed(1)}%
                              </td>
                              <td style={{ padding: "10px 12px" }}>
                                {row.avgFinishTime !== null
                                  ? row.avgFinishTime.toFixed(2)
                                  : "—"}
                              </td>
                              <td style={{ padding: "10px 12px" }}>{row.dnfCount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </ChartBox>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
