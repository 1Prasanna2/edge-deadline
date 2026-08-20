import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 700): number {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target; setDisplay(target); return;
    }
    const from = current.current;
    if (from === target) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);           // ease-out cubic
      current.current = from + (target - from) * eased;
      setDisplay(current.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}