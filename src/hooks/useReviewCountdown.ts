import { useEffect, useRef, useState } from 'react';
import { useReviewMode } from './useReviewMode';

export function useReviewCountdown(item: unknown, lastMs: number | undefined, onReveal: () => void, onFinish: (clicked: boolean) => void) {
  const { enabled, extra } = useReviewMode();
  const duration = Math.max(3000, (Number.isFinite(lastMs) ? lastMs! : 3000) + extra * 1000);
  const callbacks = useRef({ onReveal, onFinish });
  useEffect(() => { callbacks.current = { onReveal, onFinish }; });
  const [remaining, setRemaining] = useState(duration);
  const phase = useRef<'question' | 'answer' | 'done'>('question');
  const answerAt = useRef(0);
  const clickedRef = useRef(false);
  const reveal = (clicked: boolean) => {
    if (!enabled || phase.current !== 'question') return;
    phase.current = 'answer';
    answerAt.current = performance.now();
    clickedRef.current = clicked;
    setRemaining(0);
    callbacks.current.onReveal();
  };
  useEffect(() => {
    phase.current = 'question';
    setRemaining(duration);
    if (!enabled || !item) return;
    const started = performance.now();
    let frame: number;
    const tick = () => {
      const now = performance.now();
      if (phase.current === 'question') {
        const left = Math.max(0, duration - (now - started));
        setRemaining(left);
        if (left === 0) {
          phase.current = 'answer';
          answerAt.current = now;
          clickedRef.current = false;
          callbacks.current.onReveal();
        }
      } else if (phase.current === 'answer' && now - answerAt.current >= 2000) {
        phase.current = 'done';
        callbacks.current.onFinish(clickedRef.current);
      }
      if (phase.current !== 'done') frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [item, enabled, duration]);
  return { enabled, duration, remaining, reveal, cancel: () => { phase.current = 'done'; } };
}
