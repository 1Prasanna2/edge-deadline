// Onboarding/WelcomeModal.tsx
export function WelcomeModal({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4">
      <div className="card bg-panel p-6 rounded-2xl max-w-md text-center">
        <h1 className="text-2xl font-bold text-neon">EDGE <span className="text-slate-500 text-sm">FPL</span></h1>
        <p className="mt-2 text-sm text-slate-400">
          FPL‑EDGE helped managers decide. Now <b className="text-slate-200">you beat the algorithm</b>.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 num text-xs text-slate-300">
          <div className="rounded-lg bg-white/5 p-3">🎯<br />Pick 5</div>
          <div className="rounded-lg bg-white/5 p-3">🤖<br />Follow EDGE</div>
          <div className="rounded-lg bg-white/5 p-3">⚡<br />Simulate</div>
        </div>
        <div className="mt-5 flex gap-2 justify-center">
          <button className="btn-neon" onClick={onStart}>Start Tutorial (45s)</button>
          <button className="btn-ghost" onClick={onSkip}>Skip, I'm pro</button>
        </div>
      </div>
    </div>
  );
}