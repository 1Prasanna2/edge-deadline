// ALL balance knobs live in this file. If a number matters, it lives here.
export type Position = 'GKP' | 'DEF' | 'MID' | 'FWD';
/** Required starting slots per position (GKP1 DEF1 MID2 FWD1 = 5 cards). */
export const SLOTS: Record<Position, number> = { GKP: 1, DEF: 1, MID: 2, FWD: 1 };

/** Per-gameweek mode settings.
 *  ⚠️ `oppAvg` values are PLACEHOLDERS. Once simulator.ts exists, run
 *  runHarness() in the dev console and paste the printed medians here. */
export const MODES = {
    1: { label: 'Opening Weekend', budget: 36, pool: 'starter', oppAvg: 22 , elite: 28},
    2: { label: 'Core Mode',       budget: 40, pool: 'full',    oppAvg: 22 , elite: 27},
    3: { label: 'Title Run-In',    budget: 40, pool: 'full',    oppAvg: 29 , elite: 35},
} as const;
export type GW = keyof typeof MODES; // 1 | 2 | 3

/** EDGE color bands on the percentile-normalized 0–100 scale. */
export const EDGE_BANDS = { green: 70, yellow: 45 } as const;

/** Captain confidence curve: clamp(base + edgeGap * perGap, min, max). */
export const CAPTAIN_CONF = { base: 60, perGap: 3, min: 65, max: 97 } as const;

/** Simulator probabilities. SHARED by simulateGW() and xPts() so the
 *  projection and the simulation can never drift apart. */
export const SIM_PROBS = {
  appear: 0.9,        // chance of taking the field (2 pts)
  goal: 0.75,         // multiplier on xG → real goal chance
  assist: 0.6,        // multiplier on xA → real assist chance
  cleanSheetMax: 0.5, // csProb = (6 - fdr) / 5 * cleanSheetMax
  savePtsPer: 0.35,   // xS → points contribution for GKP
  doubtMiss: 0.25,    // "Doubt" tagged players miss entirely 25% of sims
} as const;

/** FPL goal points by position. */
export const GOAL_PTS: Record<Position, number> = { GKP: 4, DEF: 4, MID: 5, FWD: 5 };

/** GW3 comeback mechanic: cheap gems punch above their weight late. */
export const UNDERDOG = { gw: 3, edgeBelow: 70, mult: 1.25 } as const;

/** 6-player opening market (GW1). Full 12 unlocks in GW2. */
export const STARTER_POOL = [
  'haaland', 'palmer', 'alisson', 'trippier', 'gordon', 'watkins',
] as const;

/** Persistence keys — bump the suffix whenever a save shape changes. */
export const KEYS = {
  save: 'edge_save_v1',
  tutorial: 'edge_tut_v1',
  mute: 'edge_mute_v1',
} as const;