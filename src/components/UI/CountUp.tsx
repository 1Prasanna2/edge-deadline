import { useCountUp } from '@/hooks/useCountUp';

export function CountUp({ value, decimals = 0, className = '' }: {
  value: number; decimals?: number; className?: string;
}) {
  return <span className={`num ${className}`}>{useCountUp(value).toFixed(decimals)}</span>;
}