// GW1 base stats. This file is the warehouse: pure data, zero logic.
// The game state holds deep copies; fixtures.ts patches FDR/doubt per GW.
import { MODES, STARTER_POOL, type GW, type Position } from '@/lib/config';
export interface Player {
  id: string;
  name: string;
  tag: string;    // 2-letter avatar initials (screenshot style)
  club: string;   // emoji badge
  pos: Position;
  price: number;  // £m
  form: number;   // 0–10
  fdr: number;    // 1–5 next-fixture difficulty (GW1 base)
  xg: number;
  xa: number;
  xs?: number;    // expected saves (GKP only)
  own: number;    // ownership % (flavor now, differential UI later)
  doubt?: boolean;// set at RUNTIME by fixtures.ts — never hardcode true here
}

export const PLAYERS: Player[] = [
  // ── GKP ──────────────────────────────────────────────
  { id: 'alisson',  name: 'Alisson',   tag: 'AL', club: '🔴', pos: 'GKP', price: 5.0,  form: 6.9, fdr: 2, xg: 0,   xa: 0.10, xs: 4.2, own: 18 },
  { id: 'pickford', name: 'Pickford',  tag: 'JP', club: '🔵', pos: 'GKP', price: 4.5,  form: 5.8, fdr: 2, xg: 0,   xa: 0.05, xs: 4.8, own: 6  },
  // ── DEF ──────────────────────────────────────────────
  { id: 'trippier', name: 'Trippier',  tag: 'KT', club: '⚫', pos: 'DEF', price: 6.0,  form: 7.4, fdr: 2, xg: 0.10, xa: 0.50, own: 14 },
  { id: 'gabriel',  name: 'Gabriel',   tag: 'GA', club: '🔴', pos: 'DEF', price: 6.0,  form: 6.8, fdr: 3, xg: 0.15, xa: 0.10, own: 22 },
  { id: 'gvardiol', name: 'Gvardiol',  tag: 'GV', club: '🩵', pos: 'DEF', price: 5.5,  form: 6.2, fdr: 2, xg: 0.20, xa: 0.20, own: 9  },
  // ── MID ──────────────────────────────────────────────
  { id: 'palmer',   name: 'Palmer',    tag: 'CP', club: '🔵', pos: 'MID', price: 9.0,  form: 8.5, fdr: 2, xg: 0.71, xa: 0.40, own: 32 },
  { id: 'saka',     name: 'Saka',      tag: 'BS', club: '🔴', pos: 'MID', price: 8.5,  form: 8.2, fdr: 2, xg: 0.65, xa: 0.35, own: 28 },
  { id: 'bfern',    name: 'Fernandes', tag: 'BF', club: '🟥', pos: 'MID', price: 8.0,  form: 8.9, fdr: 5, xg: 0.60, xa: 0.45, own: 15 }, // TRAP: hot form, brutal fixture
  { id: 'gordon',   name: 'Gordon',    tag: 'AG', club: '⚫', pos: 'MID', price: 7.0,  form: 7.1, fdr: 2, xg: 0.55, xa: 0.30, own: 8  }, // differential gem
  // ── FWD ──────────────────────────────────────────────
  { id: 'haaland',  name: 'Haaland',   tag: 'EH', club: '🩵', pos: 'FWD', price: 12.5, form: 9.1, fdr: 3, xg: 1.10, xa: 0.20, own: 40 },
  { id: 'watkins',  name: 'Watkins',   tag: 'OW', club: '🦂', pos: 'FWD', price: 8.5,  form: 7.8, fdr: 2, xg: 0.80, xa: 0.30, own: 20 },
  { id: 'isak',     name: 'Isak',      tag: 'AI', club: '⚪', pos: 'FWD', price: 8.0,  form: 8.0, fdr: 4, xg: 0.75, xa: 0.25, own: 12 }, // TRAP
];

export const byId = (id: string): Player => {
  const p = PLAYERS.find(p => p.id === id);
  if (!p) throw new Error(`Unknown player id: ${id}`);
  return p;
};

/** Deep copy so runtime fixture patches never touch base data. */
export const freshPool = (): Player[] => PLAYERS.map(p => ({ ...p }));

/** Market for a gameweek: 6-player opening pool in GW1, full 12 after. */
export function poolFor(gw: GW): Player[] {
  const full = freshPool();
  if (MODES[gw].pool === 'starter') {
    return full.filter(p => (STARTER_POOL as readonly string[]).includes(p.id));
  }
  return full;
}