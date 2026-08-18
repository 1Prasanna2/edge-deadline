import { MODES, type GW } from '@/lib/config';
import type { SimOut } from '@/lib/simulator';

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i % 10) * 0.12}s`,
                   background: i % 3 ? '#00ff88' : i % 2 ? '#ffc53d' : '#ff4d6d' }} />
      ))}
    </div>
  );
}

export function ResultsModal({ gw, last, onNext }: { gw: GW; last: SimOut; onNext: () => void }) {
  const won = last.total >= MODES[gw].oppAvg;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4">
      {won && <Confetti />}
      <div className="card bg-panel rounded-2xl p-6 w-[min(560px,92vw)] max-h-[85vh] overflow-y-auto">
        <div className="text-xs text-slate-500">GW{gw} FULL‑TIME</div>
        <h2 className="num text-4xl mt-1">{last.total} <span className="text-base text-slate-400">pts • avg {MODES[gw].oppAvg}</span></h2>
        <p className={`mt-1 text-sm ${won ? 'text-neon' : 'text-warn'}`}>
          {won ? '🎉 You beat the average manager!' : 'Behind the average — comeback time.'}
        </p>
        <div className="mt-4 space-y-2">
          {last.rows.map(r => (
            <div key={r.p.id} className="border-t border-white/5 pt-2">
              <div className="flex justify-between text-sm"><b>{r.p.name}</b><span className="num text-neon">{r.pts}</span></div>
              <div className="text-xs text-slate-500">{r.events.join(' • ') || '—'}</div>
            </div>
          ))}
        </div>
        <button className="btn-neon w-full mt-5" onClick={onNext}>
          {gw === 3 ? 'Final whistle →' : `Continue to GW${gw + 1} →`}
        </button>
      </div>
    </div>
  );
}

export function DoneModal({ totals, onReset }: { totals: number[]; onReset: () => void }) {
  const total = totals.reduce((s, t) => s + t, 0);
  const avg = ([1, 2, 3] as const).reduce((s, g) => s + MODES[g].oppAvg, 0);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4">
      <div className="card bg-panel rounded-2xl p-8 text-center w-[min(440px,92vw)]">
        <div className="text-xs text-slate-500">SEASON COMPLETE</div>
        <h2 className="num text-5xl mt-2">{total}</h2>
        <p className="num text-sm text-slate-400">average manager: {avg}</p>
        <p className={`mt-3 text-sm ${total >= avg ? 'text-neon' : 'text-warn'}`}>
          {total >= avg ? '🏆 You beat the algorithm. Title charge!' : 'The algorithm wins this time. Rebuild and retry.'}
        </p>
        <button className="btn-neon w-full mt-6" onClick={onReset}>Play again</button>
      </div>
    </div>
  );
}