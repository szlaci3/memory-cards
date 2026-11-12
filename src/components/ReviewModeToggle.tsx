import { useReviewMode } from '../hooks/useReviewMode';

export default function ReviewModeToggle() {
  const { enabled, setEnabled } = useReviewMode();
  return <button type="button" className="review-mode-toggle" role="switch" aria-label="Timer mode" aria-checked={enabled} onClick={() => setEnabled(!enabled)}>
    {enabled ? 'Timer' : 'Manual'}
  </button>;
}
