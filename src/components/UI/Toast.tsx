// Toast.tsx
import type { ToastMsg } from '@/hooks/useGame';

export function Toast({ toast }: { toast: ToastMsg | null }) {
  if (!toast) return null;
  const c = toast.type === 'err' ? 'border-danger text-danger' : 'border-neon text-neon';
  return (
    <div aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-panel border ${c} num text-sm shadow-glow`}>
      {toast.msg}
    </div>
  );
}