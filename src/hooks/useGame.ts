import { useEffect, useMemo, useState } from 'react';
import { poolFor, type Player } from '@/data/players';
import { KEYS, MODES, SLOTS, type GW } from '@/lib/config';
import { applyFixtures } from '@/lib/fixtures';
import { captainRec, squadComplete, transferTip } from '@/lib/edgeScoring';
import { projection, simulateGW, xPts, type SimOut } from '@/lib/simulator';
import { mulberry32, seedFor } from '@/lib/rng';
import { sfx } from '@/lib/sfx';

export interface GameState {
  gw: GW;
  phase: 'pick' | 'results' | 'done';
  pool: Player[];
  squadIds: string[];
  captainId: string | null;
  totals: number[];
  last: SimOut | null;
}

const fresh = (): GameState => ({
  gw: 1, phase: 'pick', pool: applyFixtures(poolFor(1), 1),
  squadIds: [], captainId: null, totals: [], last: null,
});

const load = (): GameState => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.save) ?? 'null');
    if (raw?.v === 1 && raw.state?.gw) {
      const s = raw.state as GameState;
      return { ...s, pool: applyFixtures(poolFor(s.gw), s.gw) };
    }
  } catch { /* corrupted save → fresh start */ }
  return fresh();
};

export interface ToastMsg { msg: string; type: 'ok' | 'err' | 'info' }

export function useGame() {
  const [gs, setGs] = useState<GameState>(load);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(
    () => !localStorage.getItem(KEYS.tutorial) && !localStorage.getItem(KEYS.save));
  const [tutStep, setTutStep] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(KEYS.save, JSON.stringify({ v: 1, state: gs }));
  }, [gs]);

  const squad = useMemo(
    () => gs.squadIds.map(id => gs.pool.find(p => p.id === id)!),
    [gs.squadIds, gs.pool]);
  const budgetLeft = MODES[gs.gw].budget - squad.reduce((s, p) => s + p.price, 0);

  const notify = (msg: string, type: ToastMsg['type'] = 'ok') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 2500);
  };

  function add(p: Player) {
    if (gs.squadIds.includes(p.id)) return;
    if (squad.filter(s => s.pos === p.pos).length >= SLOTS[p.pos])
      return notify(`${p.pos} slots are full`, 'err');
    if (p.price > budgetLeft) {
      setRejected(p.id); window.setTimeout(() => setRejected(null), 450);
      sfx('err');
      return notify('Not enough funds', 'err');
    }
    sfx('click');
    setGs({ ...gs, squadIds: [...gs.squadIds, p.id] });
    notify(`+${xPts(p).toFixed(1)} xPts • £${(budgetLeft - p.price).toFixed(1)}m left`);
  }

  const remove = (id: string) => {
    sfx('click');
    setGs({ ...gs, squadIds: gs.squadIds.filter(s => s !== id),
            captainId: gs.captainId === id ? null : gs.captainId });
  };

  const setCaptain = (id: string) => {
    sfx('whoosh');
    setGs({ ...gs, captainId: gs.captainId === id ? null : id });
  };

  function simulate() {
    if (!squadComplete(squad)) return notify('Complete your squad first (5 cards)', 'err');
    if (!gs.captainId) return notify('Pick a captain (©) first', 'err');
    sfx('dice');
    const last = simulateGW(squad, gs.captainId, gs.gw, mulberry32(seedFor(gs.gw)));
    setGs({ ...gs, last, phase: 'results' });
  }

  function nextGW() {
    const totals = [...gs.totals, gs.last!.total];
    if (gs.gw === 3) { sfx('fanfare'); setGs({ ...gs, totals, phase: 'done' }); return; }
    const gw = (gs.gw + 1) as GW;
    sfx('whoosh');
    setGs({ ...gs, totals, gw, pool: applyFixtures(poolFor(gw), gw), phase: 'pick', last: null });
  }

  const reset = () => { localStorage.removeItem(KEYS.save); setGs(fresh()); };

  // ── onboarding ──
  const finishTutorial = () => {
    localStorage.setItem(KEYS.tutorial, '1');
    setTutStep(null); setWelcome(false);
  };
  const startTutorial = () => { setWelcome(false); setTutStep(0); };
  const skipTutorial = () => { setWelcome(false); finishTutorial(); };
  const nextTutStep = () => {
    if (tutStep === null) return;
    tutStep >= 3 ? finishTutorial() : setTutStep(tutStep + 1);
  };
  const replayTutorial = () => { setWelcome(false); setTutStep(0); };

  return {
    gs, squad, budgetLeft, toast, rejected, welcome, tutStep,
    add, remove, setCaptain, simulate, nextGW, reset,
    startTutorial, skipTutorial, finishTutorial, nextTutStep, replayTutorial,
    tip: transferTip(squad, budgetLeft),
    cap: squad.length ? captainRec(squad) : null,
    proj: projection(squad),
  };
}