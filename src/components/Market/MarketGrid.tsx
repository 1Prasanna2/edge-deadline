import { useEffect, useMemo } from 'react';
import type { Player } from '@/data/players';
import { type GW } from '@/lib/config';
import { edgeScore } from '@/lib/edgeScoring';
import { MarketHeader } from './MarketHeader';
import { PlayerCard } from './PlayerCard';

export function MarketGrid({ pool, squad, budgetLeft, gw, rejected, onAdd }: {
  pool: Player[]; squad: Player[]; budgetLeft: number; gw: GW; rejected: string | null; onAdd: (p: Player) => void;
}) {
  const sorted = useMemo(() => [...pool].sort((a, b) => edgeScore(b) - edgeScore(a)), [pool]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') { const p = sorted[Number(e.key) - 1]; if (p) onAdd(p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [sorted, onAdd]);

  return (
    <section className="space-y-2">
      <h2 className="text-xs tracking-widest text-slate-400">SQUAD MARKET</h2>
      <MarketHeader pool={pool} squad={squad} budgetLeft={budgetLeft} gw={gw} />
      {sorted.map((p, i) => (
        <PlayerCard key={p.id} p={p} i={i} first={i === 0}
          inSquad={squad.some(s => s.id === p.id)} broke={p.price > budgetLeft}
          rejected={rejected === p.id} onAdd={() => onAdd(p)} />
      ))}
    </section>
  );
}