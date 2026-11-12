import { useReviewMode } from '../hooks/useReviewMode';

export default function ReviewCountdown({ duration, remaining }: { duration: number; remaining: number }) {
  const { extra, setExtra } = useReviewMode();
  return <div className="review-countdown">
    <div className="extra-seconds">
      <button type="button" aria-label="Decrease extra seconds" disabled={extra === -3 || remaining === 0} onClick={() => setExtra(extra - 1)}>−</button>
      <div className="timer-meter"><div className="timer-fill" style={{ width: `${(extra + 3) / 12 * 100}%` }} /><span>Extra: {extra} s</span></div>
      <button type="button" aria-label="Increase extra seconds" disabled={extra === 9 || remaining === 0} onClick={() => setExtra(extra + 1)}>+</button>
    </div>
    <div className="timer-meter" role="progressbar" aria-label="Time until answer" aria-valuemin={0} aria-valuemax={duration / 1000} aria-valuenow={remaining / 1000}>
      <div className="timer-fill" style={{ width: `${remaining / duration * 100}%` }} /><span>{Number((duration / 1000).toFixed(2))} s</span>
    </div>
  </div>;
}
