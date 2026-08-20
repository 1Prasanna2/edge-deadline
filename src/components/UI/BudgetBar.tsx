import { type GW } from '@/lib/config';
import {CountUp} from './CountUp';

export function BudgetBar({ gw, totals, muted, onMute, onHelp }: {
  gw: GW; totals: number[]; muted: boolean; onMute: () => void; onHelp: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 py-2.5">
        <span className="w-9 h-9 rounded-xl bg-neon grid place-items-center font-black text-ink text-lg shadow-glow">E</span>
        <div className="leading-tight">
          <b className="text-sm">EDGE <span className="text-slate-500 text-[10px]">FPL</span></b>
          <div className="num text-[9px] text-neon tracking-widest">DEADLINE DAY v1.0</div>
        </div>
        <div className="hidden md:block ml-3 pl-3 border-l border-white/10 leading-tight">
          <b className="text-sm">Deadline Decision — Can you beat the algorithm?</b>
          <div className="text-[10px] text-slate-500">Professional draft • BTT Web Game Jam</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {([1, 2, 3] as GW[]).map(g => (
            <span key={g} className={`num text-xs px-2.5 py-1 rounded-full ${
              g === gw ? 'bg-neon text-ink font-bold shadow-glow' : g < gw ? 'text-neon border border-neon/30' : 'text-slate-600 border border-white/5'}`}>GW{g}</span>
          ))}
          <span className="num text-xs px-3 py-1 rounded-full border border-white/10">
            TOTAL <b className="text-neon"><CountUp value={totals.reduce((s, t) => s + t, 0)} /></b> pts
          </span>
          <button className="btn-ghost text-xs" onClick={onMute}>{muted ? '🔇' : '🔊'}</button>
          <button className="btn-ghost text-xs w-7 h-7 rounded-full border border-white/10" onClick={onHelp}>?</button>
        </div>
      </div>
    </header>
  );
}