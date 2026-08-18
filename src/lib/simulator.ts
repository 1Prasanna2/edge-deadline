import type { Player } from '@/data/players';
import { GOAL_PTS, SIM_PROBS, UNDERDOG } from './config';
import { edgeScore } from './edgeScoring';

const csProb = (p: Player) =>
  (p.pos === 'GKP' || p.pos === 'DEF') ? ((6 - p.fdr) / 5) * SIM_PROBS.cleanSheetMax : 0;

export const xPts = (p: Player): number => {
  const fit = p.doubt ? 1 - SIM_PROBS.doubtMiss : 1;
  const attack =
    p.xg * SIM_PROBS.goal * GOAL_PTS[p.pos] +
    p.xa * SIM_PROBS.assist * 3 +
    csProb(p) * 4 +
    (p.xs ?? 0) * SIM_PROBS.savePtsPer;
  // appearance gates BOTH the 2 pts and every attacking event:
  return fit * SIM_PROBS.appear * (2 + attack);
};

export const projection = (squad: Player[]): number =>
  squad.reduce((s, p) => s + xPts(p), 0);

export interface LineResult { p: Player; pts: number; events: string[] }
export interface SimOut { rows: LineResult[]; total: number }

export function simulateGW(
  squad: Player[], captainId: string | null, gw: number, rnd: () => number,
): SimOut {
  const rows: LineResult[] = squad.map(p => {
    const events: string[] = []; let pts = 0;

    if (p.doubt && rnd() < SIM_PROBS.doubtMiss) {
      events.push('❌ Missed (doubt)');
    } else if (rnd() < SIM_PROBS.appear) {
      pts += 2; events.push('👟 Appearance +2');
      if (rnd() < p.xg * SIM_PROBS.goal)  { pts += GOAL_PTS[p.pos]; events.push(`⚽ Goal +${GOAL_PTS[p.pos]}`); }
      if (rnd() < p.xa * SIM_PROBS.assist){ pts += 3; events.push('🅰️ Assist +3'); }
      if (csProb(p) > 0 && rnd() < csProb(p)) { pts += 4; events.push('🧤 Clean sheet +4'); }
    }

    if (gw === UNDERDOG.gw && edgeScore(p) < UNDERDOG.edgeBelow && pts > 0) {
      pts = Math.round(pts * UNDERDOG.mult); events.push('🐣 Underdog ×1.25');
    }
    if (p.id === captainId) { pts *= 2; events.push('© Captain ×2'); }
    return { p, pts, events };
  });

  return { rows, total: rows.reduce((s, r) => s + r.pts, 0) };
}