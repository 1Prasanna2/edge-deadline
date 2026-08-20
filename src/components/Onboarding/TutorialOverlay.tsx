// Onboarding/TutorialOverlay.tsx
import { useEffect, useState } from 'react';

const STEPS = [
  { sel: '[data-tut="card"]', t: 'Read a card', b: '🔥 form, FDR shield (low = easy), xG — and the big EDGE score. Green 70+ = elite.' },
  { sel: '[data-tut="budget"]', t: 'Budget is the game', b: "£ left, the spend bar and your position chips all live here. You can\'t afford every star — balance beats stars." },
  { sel: '[data-tut="assistant"]', t: 'EDGE Assistant', b: 'Captain pick + confidence, transfer tip, projection vs average. Trust it — or beat it.' },
  { sel: '[data-tut="sim"]', t: 'Simulate', b: 'Pick 5, tap © on your captain (×2 points), then SIMULATE and read the breakdown.' },
];

export function TutorialOverlay({ step, onNext, onSkip }: { step: number; onNext: () => void; onSkip: () => void }) {
  const [r, setR] = useState<DOMRect | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(STEPS[step].sel)) as HTMLElement[];
    const el = els.find(e => e.getClientRects().length > 0) ?? null;
    if (!el) return;
    el.classList.add('tut-target');
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const t = window.setTimeout(() => setR(el.getBoundingClientRect()), 300);
    return () => { clearTimeout(t); el.classList.remove('tut-target'); };
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [step]);

  if (!r) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute rounded-xl border-2 border-neon"
        style={{ top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12,
            boxShadow: '0 0 0 9999px rgba(4,8,15,.85)' }} />
      <div className="absolute left-4 right-4 md:left-auto md:w-96 card bg-panel p-4 rounded-xl"
        style={{ top: Math.min(r.bottom + 12, window.innerHeight - 200) }}>
        <b className="text-neon">{STEPS[step].t}</b>
        <p className="mt-1 text-sm text-slate-300">{STEPS[step].b}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn-neon" onClick={onNext}>{step === 3 ? 'Start GW1' : 'Next'}</button>
          <button className="btn-ghost" onClick={onSkip}>Skip</button>
          <span className="ml-auto num text-xs text-slate-500">{step + 1}/4</span>
        </div>
      </div>
    </div>
  );
}