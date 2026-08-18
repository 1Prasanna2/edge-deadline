import type { Player } from '@/data/players';
import { MODES, SLOTS, type GW, type Position } from '@/lib/config';

const POS: Position[] = ['GKP', 'DEF', 'MID', 'FWD'];

export function MarketHeader({ pool, squad, budgetLeft, gw }: {
  pool: Player[]; squad: Player[]; budgetLeft: number; gw: GW;
}) {
  const budget = MODES[gw].budget;
  const spent = budget - budgetLeft;
  return (
    <div className="card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-slate-500">BUDGET</span>
        <span className="num text-xs text-neon">£{budgetLeft.toFixed(1)}m left • £{spent.toFixed(1)}m spent</span>
      </div>
      <div data-tut="budget" className="h-1.5 rounded bg-white/10 overflow-hidden">
        <div className="h-full bg-neon transition-all duration-500" style={{ width: `${(spent / budget) * 100}%` }} />
      </div>
      <div className="flex gap-1.5 pt-1">
        {POS.map(pos => {
          const have = squad.filter(p => p.pos === pos).length;
          const full = have >= SLOTS[pos];
          return (
            <span key={pos} className={`num text-[10px] px-2 py-1 rounded-full border ${
              full ? 'border-neon/40 text-neon bg-neon/10' : 'border-white/10 text-slate-500'}`}>
              {pos} {have}/{SLOTS[pos]}
            </span>
          );
        })}
        <span className="ml-auto num text-[10px] text-slate-500 self-center">{pool.length} PLAYERS</span>
      </div>
    </div>
  );
}