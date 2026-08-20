import { PLAYERS as GENERATED_PLAYERS } from './players.generated';
import { MODES, type GW } from '@/lib/config'; // <-- Removed STARTER_POOL import
import type { Player, Position } from './players.types';

export type { Player, Position };

// Defense in depth: drop accidental duplicate IDs before they ever reach React keys
const seen = new Set<string>();
export const PLAYERS: Player[] = (GENERATED_PLAYERS as Player[]).filter(p => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  return true;
});

export const byId = (id: string): Player => {
  const p = PLAYERS.find(p => p.id === id);
  if (!p) throw new Error(`Unknown player id: ${id}`);
  return p;
};

export const freshPool = (): Player[] => PLAYERS.map(p => ({ ...p }));

export function poolFor(gw: GW): Player[] {
  const full = freshPool();
  
  if (MODES[gw].pool === 'starter') {
    // Dynamically build a balanced "Starter Pack" for the GW1 tutorial.
    // This ensures the player always has a fair mix of positions to learn the mechanics.
    const sortByForm = (a: Player, b: Player) => b.form - a.form;
    
    const gkps = full.filter(p => p.pos === 'GKP').sort(sortByForm).slice(0, 3);
    const defs = full.filter(p => p.pos === 'DEF').sort(sortByForm).slice(0, 6);
    const mids = full.filter(p => p.pos === 'MID').sort(sortByForm).slice(0, 8);
    const fwds = full.filter(p => p.pos === 'FWD').sort(sortByForm).slice(0, 5);
    
    return [...gkps, ...defs, ...mids, ...fwds];
  }
  
  return full;
}