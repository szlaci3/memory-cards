import { useSyncExternalStore } from 'react';

let timerMode = true;
let extraSeconds = 0;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const notify = () => listeners.forEach(listener => listener());

export function useReviewMode() {
  const enabled = useSyncExternalStore(subscribe, () => timerMode);
  const extra = useSyncExternalStore(subscribe, () => extraSeconds);
  return {
    enabled, extra,
    setEnabled(value: boolean) { timerMode = value; notify(); },
    setExtra(value: number) { extraSeconds = Math.max(-3, Math.min(9, value)); notify(); },
  };
}
