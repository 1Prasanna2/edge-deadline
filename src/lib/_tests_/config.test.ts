import { describe, expect, it } from 'vitest';
import { MODES , type Position } from '@/lib/config';
import { byId, poolFor, type Player } from '@/data/players';

/** Brute-force the cheapest legal 5-card squad (pool is tiny ⇒ instant). */
const cheapestComplete = (pool: Player[], budget: number): number | null => {
  const of = (pos: Position) => pool.filter(p => p.pos === pos);
  let best: number | null = null;
  for (const g of of('GKP'))
    for (const d of of('DEF'))
      for (const a of of('MID'))
        for (const b of of('MID')) {
          if (a.id >= b.id) continue; // distinct pair, no dupes
          for (const f of of('FWD')) {
            const cost = g.price + d.price + a.price + b.price + f.price;
            if (cost <= budget && (best === null || cost < best)) best = cost;
          }
        }
  return best;
};

describe('balance: every mode is winnable', () => {
  ([1, 2, 3] as const).forEach(gw => {
    it(`GW${gw}: a complete squad fits the budget`, () => {
      expect(cheapestComplete(poolFor(gw), MODES[gw].budget)).not.toBeNull();
    });
  });

  it('GW1 teach moment: the star-stacked squad must NOT fit', () => {
    const stars = ['alisson', 'trippier', 'palmer', 'gordon', 'haaland']
      .map(byId)
      .reduce((s, p) => s + p.price, 0);
    expect(stars).toBeGreaterThan(MODES[1].budget);
  });
});