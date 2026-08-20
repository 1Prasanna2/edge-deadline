import type { Player } from '@/data/players';
import { EDGE_BANDS, type Position } from '@/lib/config';
import { edgeColor, edgeScore } from '@/lib/edgeScoring';

const ring: Record<Position, string> = {
  GKP: 'ring-danger/40 text-danger', DEF: 'ring-sky-400/40 text-sky-300',
  MID: 'ring-neon/40 text-neon',     FWD: 'ring-warn/40 text-warn',
};
const fdrCls = (f: number) => f <= 2 ? 'bg-neon/15 text-neon' : f === 3 ? 'bg-warn/15 text-warn' : 'bg-danger/15 text-danger';
const band = (s: number) => s >= EDGE_BANDS.green ? 'bg-neon' : s >= EDGE_BANDS.yellow ? 'bg-warn' : 'bg-danger';

export function PlayerCard({ p, i, first, isCaptain, inSquad, broke, rejected, onAdd}: {
  p: Player; i: number; first?: boolean; isCaptain?:boolean ; inSquad: boolean; broke: boolean; rejected: boolean; onAdd: () => void;
}) {
  const s = edgeScore(p);
  return (
    <div
      data-tut={first ? 'card' : undefined}
      role="button"
      aria-label={inSquad ? `${p.name} in squad` : `Add ${p.name}`}
      onClick={() => !inSquad && onAdd()}                       // ← whole card is the add control
      className={`group card relative p-3 select-none transition hover:-translate-y-0.5 hover:shadow-glow ${
        inSquad ? 'opacity-70 cursor-default' : 'cursor-pointer'
      } ${rejected ? 'animate-shake border-danger' : ''}`}
    >
      {/* hover affordance: a + appears when the card is clickable */}
      {!inSquad && (
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon/15 text-neon grid place-items-center font-black opacity-0 group-hover:opacity-100 transition">+</span>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar Ring */}
        <span className={`w-10 h-10 rounded-full grid place-items-center bg-white/5 ring-2 num text-xs ${isCaptain ? 'ring-[#d4af37]' : ring[p.pos]}`}>{p.tag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <b className="text-sm truncate">{p.name}</b>
            <span className="text-[9px] num text-slate-400 border border-white/10 rounded px-1">{p.pos}</span>
            {isCaptain && <span className="captain-badge">© CAPTAIN</span>}
            {p.doubt && <span className="text-[9px] text-danger border border-danger/30 rounded px-1">Doubt</span>}
            <span className={`ml-auto w-6 h-6 grid place-items-center rounded-full num text-[11px] font-bold ${fdrCls(p.fdr)}`}>{p.fdr}</span>
            <span className={`num text-[9px] ${fdrCls(p.fdr)} rounded px-1`}>{p.fdr <= 2 ? 'EASY' : p.fdr === 3 ? 'MED' : 'HARD'}</span>
          </div>
          <div className="num text-[11px] text-slate-400 mt-0.5 flex justify-between">
            <span>£{p.price}m • Form {p.form}</span>
            <span>{p.pos === 'GKP' ? `xS ${p.xs}` : `xG ${p.xg}`}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 rounded bg-white/10"><div className={`h-full ${band(s)}`} style={{ width: `${s}%` }} /></div>
            <span className={`num text-[11px] ${edgeColor(s)}`}>EDGE {s}</span>
          </div>

          {/* bold, full-width, stateful ADD button */}
          <button
            onClick={e => { e.stopPropagation(); onAdd(); }}
            aria-disabled={broke || inSquad}
            className={`mt-2.5 w-full py-2 rounded-lg num text-sm font-black tracking-widest transition active:scale-95 ${
              inSquad
                ? 'bg-white/5 text-slate-500 border border-white/10 cursor-default'
                : broke
                  ? 'bg-danger/10 text-danger border border-danger/40 hover:bg-danger/20'
                  : 'bg-neon text-ink shadow-glow hover:brightness-110 group-hover:brightness-110'
            }`}
          >
            {inSquad ? 'IN SQUAD ✓' : broke ? 'NO FUNDS' : `+ ADD [${i + 1}]`}
          </button>
        </div>
      </div>
    </div>
  );
}