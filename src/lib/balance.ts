import { byId } from '@/data/players';
import { mulberry32 } from './rng';
import { projection, simulateGW } from './simulator';

export function runHarness() {
  const base = ['alisson', 'trippier', 'palmer', 'gordon', 'watkins'].map(byId);
  ([1, 2, 3] as const).forEach(gw => {
    const t: number[] = [];
    for (let i = 0; i < 1000; i++)
      t.push(simulateGW(base, null, gw, mulberry32(i + gw * 9999)).total);
    t.sort((a, b) => a - b);
    console.log(`GW${gw} → oppAvg median: ${t[500]} | elite p80: ${t[800]} | projection sanity: ${projection(base).toFixed(1)}`);
  });
}