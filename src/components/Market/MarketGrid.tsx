import { useEffect, useMemo, useRef, useState } from 'react';
import type { Player } from '@/data/players';
import { type GW } from '@/lib/config';
import { edgeScore } from '@/lib/edgeScoring';
import { MarketHeader } from './MarketHeader';
import { PlayerCard } from './PlayerCard';

export function MarketGrid({ pool, squad, budgetLeft, gw, rejected, captainId, onAdd }: {
  pool: Player[]; squad: Player[]; budgetLeft: number; gw: GW; rejected: string | null; captainId: string | null; onAdd: (p: Player) => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(() => [...pool].sort((a, b) => edgeScore(b) - edgeScore(a)), [pool]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.pos.toLowerCase().includes(q));
  }, [sorted, query]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;               // never hijack browser shortcuts
      const target = e.target as HTMLElement;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      if (typing) {                                                 // inside the search box:
        if (e.key === 'Escape') { setQuery(''); target.blur(); }    //   Esc  → clear + leave
        if (e.key === 'Enter' && visible[0]) onAdd(visible[0]);     //   Enter→ add top result
        return;                                                     //   (numbers type normally)
      }

      if (e.key === '/') { e.preventDefault(); inputRef.current?.focus(); return; }  // / → jump to search
      if (e.key >= '1' && e.key <= '9') { const p = visible[Number(e.key) - 1]; if (p) onAdd(p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [visible, onAdd]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-widest text-slate-400">SQUAD MARKET</h2>
        <span className="num text-[10px] text-slate-500">{visible.length}/{pool.length}</span>
      </div>

      {/* search aside */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search name, club or position…  ( / )"
          aria-label="Search players"
          className="w-full bg-card border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-200
                     placeholder:text-slate-500 focus:outline-none focus:border-neon/50 focus:shadow-glow transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 text-slate-300
                       hover:bg-danger/40 hover:text-white text-xs">✕</button>
        )}
      </div>

      <MarketHeader pool={pool} squad={squad} budgetLeft={budgetLeft} gw={gw} />

      {visible.map((p, i) => (
        <PlayerCard key={p.id} p={p} i={i} first={i === 0 && !query} isCaptain={p.id === captainId}
          inSquad={squad.some(s => s.id === p.id)} broke={p.price > budgetLeft}
          rejected={rejected === p.id} onAdd={() => onAdd(p)} />
      ))}

      {!visible.length && (
        <div className="card p-6 text-center text-sm text-slate-500">
          No players match "<span className="text-slate-300">{query}</span>".
          <button className="block mx-auto mt-2 text-xs text-neon hover:underline" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}