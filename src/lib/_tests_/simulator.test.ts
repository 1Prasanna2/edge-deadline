import { describe, expect, it } from 'vitest';
import { byId } from '@/data/players';
import { SIM_PROBS } from '@/lib/config';
import { mulberry32, seedFor } from '@/lib/rng';
import { projection, simulateGW, xPts } from '@/lib/simulator';

const squad = [byId('alisson'), byId('trippier'), byId('palmer'), byId('gordon'), byId('watkins')];

describe('match engine', () => {
  it('deterministic: same seed ⇒ identical result', () => {
    const a = simulateGW(squad, 'palmer', 1, mulberry32(42));
    const b = simulateGW(squad, 'palmer', 1, mulberry32(42));
    expect(a).toEqual(b);
  });

  it('captain exactly doubles that player', () => {
    const plain = simulateGW(squad, null, 1, mulberry32(7));
    const capt  = simulateGW(squad, 'palmer', 1, mulberry32(7));
    const base  = plain.rows.find(r => r.p.id === 'palmer')!.pts;
    expect(capt.total - plain.total).toBe(base);
  });

  it('points never go negative (200 seeds)', () => {
    for (let i = 0; i < 200; i++) {
      const out = simulateGW(squad, 'palmer', 2, mulberry32(i));
      expect(out.total).toBeGreaterThanOrEqual(0);
      for (const r of out.rows) expect(r.pts).toBeGreaterThanOrEqual(0);
    }
  });

  it('projection ≈ sim average over 400 runs (no drift)', () => {
    let sum = 0; const N = 400;
    for (let i = 0; i < N; i++) sum += simulateGW(squad, null, 1, mulberry32(i)).total;
    expect(Math.abs(sum / N - projection(squad))).toBeLessThan(1.5);
  });

  it('xPts discounts doubt players by the miss chance', () => {
    const p = byId('palmer');
    expect(xPts({ ...p, doubt: true })).toBeCloseTo(xPts(p) * (1 - SIM_PROBS.doubtMiss), 5);
  });

  it('seedFor: stable per GW, different across GWs', () => {
    expect(seedFor(1)).toBe(seedFor(1));
    expect(seedFor(1)).not.toBe(seedFor(2));
  });
});