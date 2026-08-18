import { describe, expect, it } from 'vitest';
import { PLAYERS, byId } from '@/data/players';
import { EDGE_BANDS } from '@/lib/config';
import { captainRec, edgeColor, edgeScore, squadComplete, transferTip } from '@/lib/edgeScoring';

describe('EDGE scoring', () => {
  const scores = PLAYERS.map(edgeScore);

  it('colors actually spread: at least one green AND one sub-yellow', () => {
    expect(Math.max(...scores)).toBeGreaterThanOrEqual(EDGE_BANDS.green);
    expect(Math.min(...scores)).toBeLessThan(EDGE_BANDS.yellow);
  });

  it('edgeColor maps the three bands', () => {
    expect(edgeColor(90)).toBe('text-neon');
    expect(edgeColor(50)).toBe('text-warn');
    expect(edgeColor(20)).toBe('text-danger');
  });

  it('fixture trap: elite form + hard fixture is NOT green', () => {
    expect(edgeScore(byId('bfern'))).toBeLessThan(EDGE_BANDS.green);
  });
});

describe('assistant invariants ("never lies")', () => {
  it('incomplete squad ⇒ always a BUY tip, never "optimal"', () => {
    expect(transferTip([byId('palmer')], 40)?.kind).toBe('BUY');
  });

  it('BUY tip respects the missing position AND the budget', () => {
    const squad = [byId('alisson'), byId('palmer'), byId('gordon'), byId('haaland')]; // no DEF
    const tip = transferTip(squad, 5.5);
    expect(tip?.kind).toBe('BUY');
    if (tip?.kind === 'BUY') {
      expect(tip.p.pos).toBe('DEF');
      expect(tip.p.price).toBeLessThanOrEqual(5.5);
    }
  });

  it('complete squad + zero budget ⇒ "optimal" (null tip)', () => {
    const squad = [byId('alisson'), byId('gvardiol'), byId('gordon'), byId('bfern'), byId('isak')];
    expect(squadComplete(squad)).toBe(true);
    expect(transferTip(squad, 0)).toBeNull();
  });

  it('captain confidence clamped 65–97 and picks top EDGE', () => {
    const solo = captainRec([byId('palmer')]);
    expect(solo.confidence).toBeGreaterThanOrEqual(65);
    expect(solo.confidence).toBeLessThanOrEqual(97);
    const duo = captainRec([byId('watkins'), byId('palmer')]);
    expect(duo.pick.id).toBe('palmer');
  });
});