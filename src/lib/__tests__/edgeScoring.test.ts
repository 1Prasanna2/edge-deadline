import { describe, expect, it } from 'vitest';
import { PLAYERS } from '@/data/players';
import { captainRec, components, edgeColor, edgeScore, squadComplete, transferTip } from '@/lib/edgeScoring';

describe('EDGE scoring', () => {
  it('pool is loaded', () => {
    expect(PLAYERS.length).toBeGreaterThan(0);
  });

  it('scores span the full scale and colors differ (when data has signal)', () => {
    const scores = PLAYERS.map(edgeScore);
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    // Guard: fully degenerate data (every stat identical) has nothing to rank
    const hasSignal = new Set(
      PLAYERS.map(p => `${p.form}|${p.fdr}|${p.xg}|${p.xa}|${p.xs ?? 0}`),
    ).size > 1;
    if (!hasSignal) return;

    expect(max).toBeGreaterThan(min);
    expect(max).toBe(100); // min-max normalization guarantees the scale
    expect(min).toBe(0);
    expect(edgeColor(max)).not.toBe(edgeColor(min));
  });

  it('edgeColor maps the three bands correctly', () => {
    expect(edgeColor(90)).toBe('text-neon');
    expect(edgeColor(50)).toBe('text-warn');
    expect(edgeColor(20)).toBe('text-danger');
  });

  it('fixture component rewards easy fixtures', () => {
    const easy = PLAYERS.find(p => p.fdr <= 2);
    const hard = PLAYERS.find(p => p.fdr >= 4);
    if (easy && hard) {
      expect(components(easy).fix).toBeGreaterThan(components(hard).fix);
    }
  });
});

describe('assistant invariants ("never lies")', () => {
  it('incomplete squad ⇒ always a BUY tip, never "optimal"', () => {
    expect(transferTip([PLAYERS[0]], 100)?.kind).toBe('BUY');
  });

  it('BUY tip respects the missing position AND the budget', () => {
    const gkp  = PLAYERS.find(p => p.pos === 'GKP')!;
    const mid1 = PLAYERS.find(p => p.pos === 'MID')!;
    const mid2 = PLAYERS.filter(p => p.pos === 'MID' && p.id !== mid1.id)[0];
    const fwd  = PLAYERS.find(p => p.pos === 'FWD')!;

    const tip = transferTip([gkp, mid1, mid2, fwd], 20);
    expect(tip?.kind).toBe('BUY');
    if (tip?.kind === 'BUY') {
      expect(tip.p.pos).toBe('DEF');
      expect(tip.p.price).toBeLessThanOrEqual(20);
    }
  });

  it('complete squad ⇒ NEVER suggests a BUY (only SWAP or null)', () => {
    const gkp  = PLAYERS.find(p => p.pos === 'GKP')!;
    const def  = PLAYERS.find(p => p.pos === 'DEF')!;
    const mids = PLAYERS.filter(p => p.pos === 'MID').slice(0, 2);
    const fwd  = PLAYERS.find(p => p.pos === 'FWD')!;

    const squad = [gkp, def, ...mids, fwd];
    expect(squadComplete(squad)).toBe(true);
    const tip = transferTip(squad, 100);
    expect(tip === null || tip.kind === 'SWAP').toBe(true);
  });

  it('captain confidence clamped 65–97 and picks top EDGE', () => {
    const [p1, p2] = PLAYERS;
    const solo = captainRec([p1]);
    expect(solo.confidence).toBeGreaterThanOrEqual(65);
    expect(solo.confidence).toBeLessThanOrEqual(97);

    const duo = captainRec([p1, p2]);
    expect(duo.pick.id).toBe(edgeScore(p1) >= edgeScore(p2) ? p1.id : p2.id);
  });
});