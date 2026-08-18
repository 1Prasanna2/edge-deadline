import type { Player } from '@/data/players';
import type { GW } from './config';

const DOUBTS_BY_GW: Record<GW, string[]> = { 1: [], 2: ['palmer'], 3: ['saka'] };

export function applyFixtures(pool: Player[], gw: GW): Player[] {
  const doubts = DOUBTS_BY_GW[gw];
  return pool.map(p => ({ ...p, fdr: p.fdrs[gw - 1] ?? p.fdr, doubt: doubts.includes(p.id) }));
}