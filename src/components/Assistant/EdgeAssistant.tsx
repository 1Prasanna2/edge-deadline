import type { Player } from '@/data/players';
import { MODES, SIM_PROBS, type GW } from '@/lib/config';
import { captainRec, edgeScore, squadComplete, transferTip } from '@/lib/edgeScoring';
import { projection } from '@/lib/simulator';
import { CountUp } from '@/components/UI/CountUp';

const seg = (v?: number) => v === undefined ? 'bg-white/10' : v <= 2 ? 'bg-neon' : v === 3 ? 'bg-warn' : 'bg-danger';
const badgeCls = (v: number) => v <= 2 ? 'bg-neon text-ink' : v === 3 ? 'bg-warn text-ink' : 'bg-danger text-ink';

export function EdgeAssistant({ squad, pool, budgetLeft, gw }: {
  squad: Player[]; pool: Player[]; budgetLeft: number; gw: GW;
}) {
  const cap = squad.length ? captainRec(squad) : null;
  const tip = transferTip(squad, budgetLeft);
  const proj = projection(squad);
  const m = MODES[gw];
  const delta = proj - m.oppAvg;
  const doubted = squad.filter(p => p.doubt);
  const grade = proj >= m.elite ? ['ELITE', 'text-neon border-neon/40 bg-neon/10']
    : proj >= m.oppAvg ? ['SOLID', 'text-warn border-warn/40 bg-warn/10']
    : ['RISKY', 'text-danger border-danger/40 bg-danger/10'];

  const cover = (p: Player) => pool
    .filter(q => q.pos === p.pos && !squad.some(s => s.id === q.id) && q.price <= budgetLeft + p.price)
    .sort((a, b) => edgeScore(b) - edgeScore(a))[0];

  return (
    <aside data-tut="assistant" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-widest text-slate-300"><span className="text-neon">●</span> EDGE ASSISTANT</h2>
        <span className="text-[9px] num px-2 py-0.5 rounded-full border border-neon/40 text-neon bg-neon/10">LIVE</span>
      </div>
      <p className="text-[10px] text-slate-500 -mt-2">Algorithm-based scoring • form × fixture inverse × xG model • Professional guidance from FPL‑EDGE methodology</p>

      <div className="card p-3 border-neon/20 bg-neon/5">
        <div className="flex justify-between text-[10px] tracking-widest"><span className="text-slate-400">CAPTAIN RECOMMENDATION</span><span className="text-neon">CONFIDENCE</span></div>
        {cap ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-neon text-ink grid place-items-center font-black text-sm">C</span>
            <div className="flex-1">
              <b className="text-sm">{cap.pick.name}</b>
              <div className="num text-[10px] text-slate-400">EDGE {edgeScore(cap.pick)} • FDR {cap.pick.fdr} • Form {cap.pick.form}</div>
            </div>
            <div className="text-right">
              <div className="num text-2xl text-neon">{cap.confidence}%</div>
              <div className="text-[9px] text-slate-500">model certainty</div>
            </div>
          </div>
        ) : <p className="mt-2 text-xs text-slate-500">Add players to get a captain pick.</p>}
      </div>

      {doubted.length > 0 && (
        <div className="card p-3 border-danger/30 bg-danger/5">
          <div className="text-[10px] tracking-widest text-danger">⚠ INJURY WATCH</div>
          {doubted.map(p => {
            const alt = cover(p);
            return (
              <p key={p.id} className="mt-1 text-xs text-slate-300">
                {p.name} is doubtful — {Math.round(SIM_PROBS.doubtMiss * 100)}% chance of 0 pts.
                {alt && <span className="text-neon"> Cover: {alt.name} (EDGE {edgeScore(alt)}).</span>}
              </p>
            );
          })}
        </div>
      )}

      <div className="card p-3">
        <div className="text-[10px] tracking-widest text-slate-400">TRANSFER RECOMMENDATION</div>
        <p className="mt-1 text-xs">
          {tip?.kind === 'BUY'  && <span className="text-neon">Buy {tip.p.name} — {tip.why}</span>}
          {tip?.kind === 'SWAP' && <span className="text-neon">Sell {tip.out.name} → {tip.p.name} ({tip.why})</span>}
          {!tip && squadComplete(squad) && <span className="text-neon">✓ Squad is EDGE‑optimal for GW{gw}</span>}
          {!tip && !squadComplete(squad) && <span className="text-warn">No affordable way to complete squad — free up funds.</span>}
        </p>
      </div>

      <div className="card p-3">
        <div className="flex justify-between text-[10px]"><span className="tracking-widest text-slate-400">FIXTURE DIFFICULTY • YOUR SQUAD GW{gw}</span><span className="num text-slate-500">1 easy — 5 hard</span></div>
        <div className="mt-2 space-y-1.5">
          {squad.map(p => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <span className="w-16 truncate">{p.name}</span>
              <div className="flex-1 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${seg(p.fdrs[gw - 1 + i])}`} />
                ))}
              </div>
              <span className={`w-5 h-5 grid place-items-center rounded-full num text-[10px] font-bold ${badgeCls(p.fdr)}`}>{p.fdr}</span>
            </div>
          ))}
          {!squad.length && <p className="text-xs text-slate-600">Your squad's fixture run appears here.</p>}
        </div>
        <div className="mt-2 flex gap-3 text-[9px] num text-slate-500">
          <span><i className="inline-block w-2 h-2 rounded-full bg-neon" /> EASY</span>
          <span><i className="inline-block w-2 h-2 rounded-full bg-warn" /> MED</span>
          <span><i className="inline-block w-2 h-2 rounded-full bg-danger" /> HARD</span>
        </div>
      </div>

      <div className="card p-3">
        <div className="flex justify-between text-[10px]"><span className="tracking-widest text-slate-400">EXPECTED POINTS</span><span className="num text-slate-500">GW{gw} PROJECTION</span></div>
        <div className="mt-1 flex items-end justify-between">
          <span className="text-4xl"><CountUp value={proj} decimals={1} /> <span className="text-xs text-slate-500">pts</span></span>
          <span className={`num text-[10px] px-2 py-1 rounded-full border ${grade[1]}`}>{grade[0]}</span>
        </div>
        <div className={`num text-[11px] mt-1 ${delta >= 0 ? 'text-neon' : 'text-danger'}`}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)} vs avg {m.oppAvg}
        </div>
      </div>
    </aside>
  );
}