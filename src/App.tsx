import { useState } from 'react';
import { EdgeAssistant } from '@/components/Assistant/EdgeAssistant';
import { MarketGrid } from '@/components/Market/MarketGrid';
import { WelcomeModal } from '@/components/Onboarding/WelcomeModal';
import { TutorialOverlay } from '@/components/Onboarding/TutorialOverlay';
import { TacticalPitch } from '@/components/Pitch/TacticalPitch';
import { DoneModal, ResultsModal } from '@/components/Results/ResultsModal';
import { BudgetBar } from '@/components/UI/BudgetBar';
import { Toast } from '@/components/UI/Toast';
import { useGame } from '@/hooks/useGame';
import { isMuted, toggleMute } from '@/lib/sfx';

export default function App() {
  const g = useGame();
  const [muted, setMuted] = useState(isMuted());
  const showObjective = g.gs.phase === 'pick' && g.gs.totals.length === 0 && !g.welcome && g.tutStep === null;

  return (
    <div className="min-h-screen">
      <BudgetBar gw={g.gs.gw} totals={g.gs.totals} muted={muted}
        onMute={() => setMuted(toggleMute())} onHelp={g.replayTutorial} />

      {showObjective && (
        <p className="text-center text-xs text-slate-500 py-2">
          GW{g.gs.gw}: Pick 5 → set © captain → Simulate
        </p>
      )}

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 pb-24 lg:pb-4">
    <div className="lg:col-span-4">
      <MarketGrid pool={g.gs.pool} squad={g.squad} budgetLeft={g.budgetLeft}
       gw={g.gs.gw} rejected={g.rejected} captainId={g.gs.captainId} onAdd={g.add} />
    </div>
   <div className="lg:col-span-5">
      <TacticalPitch squad={g.squad} captainId={g.gs.captainId}
       suggestedCaptainId={!g.gs.captainId && g.cap ? g.cap.pick.id : null}
        onCaptain={g.setCaptain} onRemove={g.remove} />
      <button data-tut="sim" onClick={g.simulate}
       className="btn-neon w-full mt-3 text-lg hidden lg:block">⚡ SIMULATE GW{g.gs.gw}</button>
    </div>
    <div className="lg:col-span-3">
     <EdgeAssistant squad={g.squad} pool={g.gs.pool} budgetLeft={g.budgetLeft} gw={g.gs.gw} />
       </div>
  </main>

  {g.gs.phase === 'pick' && (
  <div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-ink/90 backdrop-blur border-t border-white/10 lg:hidden">
    <div className="flex items-center gap-3">
      <span className="num text-xs text-slate-400 whitespace-nowrap">£{g.budgetLeft.toFixed(1)}m left</span>
      <button data-tut="sim" className="btn-neon flex-1 text-lg" onClick={g.simulate}>⚡ SIMULATE GW{g.gs.gw}</button>
    </div>
  </div>
)}

      {g.welcome && <WelcomeModal onStart={g.startTutorial} onSkip={g.skipTutorial} />}
      {g.tutStep !== null && <TutorialOverlay step={g.tutStep} onNext={g.nextTutStep} onSkip={g.finishTutorial} />}
      {g.gs.phase === 'results' && g.gs.last && <ResultsModal gw={g.gs.gw} last={g.gs.last} onNext={g.nextGW} />}
      {g.gs.phase === 'done' && <DoneModal totals={g.gs.totals} onReset={g.reset} />}
      <Toast toast={g.toast} />
    </div>
  );
}