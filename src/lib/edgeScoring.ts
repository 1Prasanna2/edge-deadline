import { PLAYERS, type Player, type Position } from '@/data/players';
import { CAPTAIN_CONF, EDGE_BANDS, SLOTS } from './config';

const values = (pick: (p: Player) => number) => PLAYERS.map(pick);
const pct = (v: number, all: number[]) =>
  all.length < 2 ? 50 : (all.filter(x => x < v).length / (all.length - 1)) * 100;

/** 0–100 percentile per component (FPL-Edge methodology). */
export function components(p: Player) {
  return {
    form: pct(p.form, values(x => x.form)),
    fix:  pct(6 - p.fdr, values(x => 6 - x.fdr)),
    att:  pct(p.xg * 3 + p.xa * 2 + (p.xs ?? 0) * 0.4,
              values(x => x.xg * 3 + x.xa * 2 + (x.xs ?? 0) * 0.4)),
  };
}

const composite = (p: Player) => {
  const c = components(p);
  return c.form * 0.4 + c.fix * 0.3 + c.att * 0.3;
};

// GW1 baseline distribution → min-max normalize so the scale ALWAYS spans 0–100
const BASELINE = PLAYERS.map(composite);
const LO = BASELINE.length ? Math.min(...BASELINE) : 0;
const HI = BASELINE.length ? Math.max(...BASELINE) : 1;

export const edgeScore = (p: Player): number =>
  HI === LO ? 50 : Math.min(100, Math.max(0,
    Math.round(((composite(p) - LO) / (HI - LO)) * 100)));

export const edgeColor = (s: number): string =>
  s >= EDGE_BANDS.green ? 'text-neon' : s >= EDGE_BANDS.yellow ? 'text-warn' : 'text-danger';

export const squadComplete = (squad: Player[]): boolean =>
  (Object.keys(SLOTS) as Position[]).every(
    pos => squad.filter(p => p.pos === pos).length >= SLOTS[pos]);

export function captainRec(squad: Player[]) {
  const sorted = [...squad].sort((a, b) => edgeScore(b) - edgeScore(a));
  const gap = sorted[1] ? edgeScore(sorted[0]) - edgeScore(sorted[1]) : 20;
  const confidence = Math.min(CAPTAIN_CONF.max,
    Math.max(CAPTAIN_CONF.min, CAPTAIN_CONF.base + gap * CAPTAIN_CONF.perGap));
  return { pick: sorted[0], confidence };
}

export type Tip =
  | { kind: 'BUY';  p: Player; why: string }
  | { kind: 'SWAP'; p: Player; out: Player; why: string };

export function transferTip(squad: Player[], budget: number): Tip | null {
  const inSquad = (p: Player) => squad.some(s => s.id === p.id);

  if (!squadComplete(squad)) {
    const need = (Object.keys(SLOTS) as Position[]).find(
      pos => squad.filter(p => p.pos === pos).length < SLOTS[pos])!;
    const best = PLAYERS
      .filter(p => !inSquad(p) && p.pos === need && p.price <= budget)
      .sort((a, b) => edgeScore(b) - edgeScore(a))[0];
    return best ? { kind: 'BUY', p: best, why: `Complete your squad (${need})` } : null;
  }

  const worst = [...squad].sort((a, b) => edgeScore(a) - edgeScore(b))[0];
  const up = PLAYERS
    .filter(p => !inSquad(p) && p.price <= budget + worst.price)
    .sort((a, b) => edgeScore(b) - edgeScore(a))[0];

  if (up && edgeScore(up) - edgeScore(worst) >= 8)
    return { kind: 'SWAP', p: up, out: worst, why: `+${edgeScore(up) - edgeScore(worst)} EDGE` };
  return null;
}