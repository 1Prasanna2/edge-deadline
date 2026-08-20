import { describe, expect, it } from 'vitest';
import { MODES } from '@/lib/config';
import { poolFor, type Position } from '@/data/players';

describe('balance: every mode is winnable', () => {
  ([1, 2, 3] as const).forEach(gw => {
    it(`GW${gw}: a complete squad fits the budget`, () => {
      const pool = poolFor(gw);
      // Greedy approach: pick the absolute cheapest player for each required slot
      const cheapest = (pos: Position) => pool.filter(p => p.pos === pos).sort((a, b) => a.price - b.price)[0];
      
      const gkp = cheapest('GKP');
      const def = cheapest('DEF');
      const mids = pool.filter(p => p.pos === 'MID').sort((a, b) => a.price - b.price).slice(0, 2);
      const fwd = cheapest('FWD');
      
      if (!gkp || !def || mids.length < 2 || !fwd) {
        throw new Error(`Pool for GW${gw} doesn't have enough players to form a squad`);
      }
      
      const cost = gkp.price + def.price + mids[0].price + mids[1].price + fwd.price;
      expect(cost).toBeLessThanOrEqual(MODES[gw].budget);
    });
  });

  it('GW1 teach moment: the 5 most expensive players must NOT fit', () => {
    const pool = poolFor(1);
    const mostExpensive = [...pool].sort((a, b) => b.price - a.price).slice(0, 5);
    const starsCost = mostExpensive.reduce((s, p) => s + p.price, 0);
    expect(starsCost).toBeGreaterThan(MODES[1].budget);
  });
});