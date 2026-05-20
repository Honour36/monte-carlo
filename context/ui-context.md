# UI Context

## Theme

Dark only. No light mode. The design language is a dark technical dashboard —
near-black backgrounds, layered surfaces, and a single vivid accent color
(orange) for primary actions. Chart lines use per-car colors. Everything else
is neutral slate.

## Colors

All components use these tokens via inline CSS. No hardcoded hex values outside
this file and the DEFAULT_CARS definition.

| Role                  | Token name (inline var)  | Value     |
| --------------------- | ------------------------ | --------- |
| Page background       | `--bg-base`              | `#020817` |
| Surface (cards/panel) | `--bg-surface`           | `#0f172a` |
| Elevated surface      | `--bg-elevated`          | `#1e293b` |
| Primary text          | `--text-primary`         | `#f1f5f9` |
| Secondary text        | `--text-secondary`       | `#94a3b8` |
| Muted text / labels   | `--text-muted`           | `#64748b` |
| Subtle text           | `--text-subtle`          | `#475569` |
| Primary accent        | `--accent-primary`       | `#f97316` |
| Border default        | `--border-default`       | `#1e293b` |
| Border emphasis       | `--border-emphasis`      | `#334155` |
| Error / DNF           | `--state-error`          | `#ef4444` |

## Car Colors (accent per car — not global tokens)

| Car              | Hex       |
| ---------------- | --------- |
| Apex Predator    | `#f97316` |
| Rocket Boy       | `#22d3ee` |
| Steady Cruiser   | `#a78bfa` |

Car colors are defined in `DEFAULT_CARS` and flow through all chart lines,
result cards, sidebar borders, and Monte Carlo bars.

## Typography

| Role         | Font                              |
| ------------ | --------------------------------- |
| All UI text  | `'DM Mono', 'Courier New', monospace` |
| Numbers/data | Same — monospace keeps columns aligned |

No serif. No sans-serif. Monospace throughout for the technical dashboard feel.

## Border Radius

| Context           | Value  |
| ----------------- | ------ |
| Cards / panels    | `8px`  |
| Buttons           | `6px`  |
| Chips / badges    | `4px`  |
| Dots (car color)  | `50%`  |

## Component Library

No external component library. All components are hand-written inline with
style props. Do not add shadcn/ui or any other component library — it would
require a build step and break the artifact runtime.

## Layout Patterns

- **Overall**: Full-viewport flex row — fixed sidebar left, scrollable main right
- **Sidebar**: Fixed 280px width, `border-right: 1px solid #1e293b`, scrollable
- **Header**: Full-width top bar, `border-bottom: 1px solid #1e293b`, flex row
- **Tabs**: Border-bottom indicator style, no background fill on active tab
- **Charts**: Wrapped in `ChartBox` (surface background, 1px border, 8px radius)
- **Result cards**: 3-column grid, surface background, colored left-border accent

## Icons / Symbols

No icon library. Use Unicode symbols inline where needed:
- `▶` for Run Race button
- `⟳` for Monte Carlo button
- `⚡` for the header logo
- `🥇 🥈 🥉` for finish position medals
