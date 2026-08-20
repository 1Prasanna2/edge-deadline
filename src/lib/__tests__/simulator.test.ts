import { describe, expect, it } from 'vitest';
import { PLAYERS } from '@/data/players';
import { SIM_PROBS } from '@/lib/config';
import { mulberry32, seedFor } from '@/lib/rng';
import { projection, simulateGW, xPts } from '@/lib/simulator';

// Dynamically build a valid squad for testing
const gkp = PLAYERS.find(p => p.pos === 'GKP')!;
const def = PLAYERS.find(p => p.pos === 'DEF')!;
const mids = PLAYERS.filter(p => p.pos === 'MID').slice(0, 2);
const fwd = PLAYERS.find(p => p.pos === 'FWD')!;
const squad = [gkp, def, ...mids, fwd];
const captainId = mids[0]?.id || null;

describe('match engine', () => {
  it('deterministic: same seed ⇒ identical result', () => {
    const a = simulateGW(squad, captainId, 1, mulberry32(42));
    const b = simulateGW(squad, captainId, 1, mulberry32(42));
    expect(a).toEqual(b);
  });

  it('captain exactly doubles that player', () => {
    const plain = simulateGW(squad, null, 1, mulberry32(7));
    const capt  = simulateGW(squad, captainId, 1, mulberry32(7));
    const base  = plain.rows.find(r => r.p.id === captainId)!.pts;
    expect(capt.total - plain.total).toBe(base);
  });

  it('points never go negative (50 seeds)', () => {
    for (let i = 0; i < 50; i++) {
      const out = simulateGW(squad, captainId, 2, mulberry32(i));
      expect(out.total).toBeGreaterThanOrEqual(0);
      for (const r of out.rows) expect(r.pts).toBeGreaterThanOrEqual(0);
    }
  });

  it('projection ≈ sim average over 100 runs (no drift)', () => {
    let sum = 0; const N = 100;
    for (let i = 0; i < N; i++) sum += simulateGW(squad, null, 1, mulberry32(i)).total;
    // Slightly wider margin (2.5) to account for variance in dynamic pool sizes
    expect(Math.abs(sum / N - projection(squad))).toBeLessThan(2.5); 
  });

  it('xPts discounts doubt players by the miss chance', () => {
    const p = PLAYERS[0];
    expect(xPts({ ...p, doubt: true })).toBeCloseTo(xPts(p) * (1 - SIM_PROBS.doubtMiss), 5);
  });

  it('seedFor: stable per GW, different across GWs', () => {
    expect(seedFor(1)).toBe(seedFor(1));
    expect(seedFor(1)).not.toBe(seedFor(2));
  });
});