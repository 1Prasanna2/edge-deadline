import type { Player } from '@/data/players';
import type { GW } from '@/lib/config';

const FDR_BY_GW: Record<2 | 3, Record<string, number>> = {
  2: { haaland: 2, isak: 5, bfern: 4, palmer: 3, gvardiol: 3 },
  3: { haaland: 4, isak: 2, bfern: 2, saka: 4, pickford: 2 },
};

const DOUBTS_BY_GW: Record<2 | 3, string[]> = {
  2: ['palmer'],
  3: ['saka'],
};

export function applyFixtures(pool: Player[], gw: GW): Player[] {
  const fdr    = FDR_BY_GW[gw as 2 | 3] ?? {};
  const doubts = DOUBTS_BY_GW[gw as 2 | 3] ?? [];
  return pool.map(p => ({
    ...p,
    fdr: fdr[p.id] ?? p.fdr,
    doubt: doubts.includes(p.id),
  }));
}