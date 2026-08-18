import { KEYS } from './config';

let ctx: AudioContext | null = null;
let muted = localStorage.getItem(KEYS.mute) === '1';
const ac = () => (ctx ??= new AudioContext());

function blip(freq: number, dur = 0.08, type: OscillatorType = 'square', gain = 0.04) {
  if (muted) return;
  const c = ac();
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq; g.gain.value = gain;
  o.connect(g); g.connect(c.destination); o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.stop(c.currentTime + dur);
}

export const sfx = (k: 'click' | 'err' | 'whoosh' | 'dice' | 'fanfare') => {
  if (k === 'click') blip(660);
  if (k === 'err') blip(160, 0.15, 'sawtooth');
  if (k === 'whoosh') blip(880, 0.12, 'sine');
  if (k === 'dice') { blip(440); setTimeout(() => blip(550), 90); setTimeout(() => blip(660), 180); }
  if (k === 'fanfare') [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.18, 'triangle', 0.06), i * 120));
};

export const isMuted = () => muted;
export const toggleMute = () => {
  muted = !muted;
  localStorage.setItem(KEYS.mute, muted ? '1' : '0');
  return muted;
};