import type { Player } from '@/data/players';
import { SLOTS , type Position} from '@/lib/config';
import { edgeScore } from '@/lib/edgeScoring';

const ORDER: Position[] = ['FWD', 'MID', 'DEF', 'GKP']

export function TacticalPitch({ squad, captainId, suggestedCaptainId, onCaptain, onRemove }: {
  squad: Player[]; captainId: string | null; suggestedCaptainId: string | null;
  onCaptain: (id: string) => void; onRemove: (id: string) => void;
}) {
  return (
    <section
      className="relative rounded-2xl border border-neon/20 overflow-hidden p-6 min-h-[560px] lg:min-h-[680px]"
      style={{
        // lighter turf + mowed-grass stripes
        background:
          'repeating-linear-gradient(0deg, rgba(0,255,136,.05) 0 44px, rgba(0,255,136,.015) 44px 88px), linear-gradient(180deg, #143524 0%, #0f2a1b 55%, #0c2115 100%)',
      }}>
      {/* lighter, crisper pitch markings */}
      <svg className="absolute inset-0 h-full w-full opacity-35 pointer-events-none" aria-hidden>
        <rect x="4%" y="2%" width="92%" height="96%" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <line x1="4%" y1="50%" x2="96%" y2="50%" stroke="#00ff88" strokeWidth="1.5" />
        <circle cx="50%" cy="50%" r="70" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <rect x="30%" y="2%" width="40%" height="13%" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <rect x="30%" y="85%" width="40%" height="13%" fill="none" stroke="#00ff88" strokeWidth="1.5" />
      </svg>

      <div className="relative z-10 space-y-8 py-3">
        {ORDER.map(pos => (
          <div key={pos} className={`grid gap-4 mx-auto ${SLOTS[pos] === 2 ? 'grid-cols-2 max-w-[95%]' : 'grid-cols-1 max-w-[55%]'}`}>
            {Array.from({ length: SLOTS[pos] }).map((_, si) => {
              const p = squad.filter(q => q.pos === pos)[si];
              return p ? (
                <div key={si}
                  className={`relative rounded-xl p-4 pt-7 text-center backdrop-blur transition hover:scale-[1.03] ${
                    captainId === p.id
                      ? 'captain-card'          // captain = max highlight
                      : 'bg-[#1a3d29]/90 border border-neon/50 shadow-glow'     // every placed player glows
                  }`}>
                  <span className="absolute top-2 left-2.5 text-[10px] num text-neon/80">{pos}</span>
                  <button onClick={() => onRemove(p.id)} title="Remove"
                    className="absolute top-2 right-9 w-6 h-6 rounded-full bg-white/10 text-slate-300 hover:bg-danger/50 hover:text-white text-xs">✕</button>
                  <button onClick={() => onCaptain(p.id)} title="Captain (×2)"
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full num text-xs ${
                      captainId === p.id ? 'captain-btn' : 'bg-white/10 text-slate-200 hover:bg-white/25'}`}>C</button>
                  {suggestedCaptainId === p.id && captainId !== p.id && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neon text-ink text-[11px] font-black grid place-items-center animate-pulse shadow-glow">C</span>
                  )}
                  <span className="mx-auto w-11 h-11 rounded-full grid place-items-center bg-white/10 ring-2 ring-neon/60 num text-sm text-slate-100">{p.tag}</span>
                  <b className="block text-base text-slate-50 mt-1.5">{p.name}</b>
                  {captainId === p.id && <span className="captain-badge">© CAPTAIN</span>}
                  <span className="num text-[11px] text-slate-300">EDGE {edgeScore(p)} <span className="text-neon">●</span></span>
                </div>
              ) : (
                <div key={si} className="rounded-xl border-2 border-dashed border-white/25 bg-white/5 p-5 text-center text-xs num text-slate-500">
                  {pos}<br />Empty
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}