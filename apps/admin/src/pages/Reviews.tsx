import { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useReviews } from '@repo/api';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function Reviews() {
  const { data: reviews, isLoading, error } = useReviews();

  const [index, setIndex] = useState(0);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const review = reviews?.[index];

  function nextReview() {
    if (!reviews || reviews.length === 0) return;
    setReplying(false);
    setReplyText('');
    setIndex((i) => (i + 1) % reviews.length);
  }

  function sendReply() {
    if (!replyText.trim()) return;
    setReplying(false);
    setShowSuccess(true);
  }

  function closeSuccess() {
    setShowSuccess(false);
    setReplyText('');
  }

  const reviewerName = review?.booking?.user
    ? [review.booking.user.first_name, review.booking.user.last_name]
        .filter(Boolean)
        .join(' ') || 'Unknown user'
    : 'Unknown user';

  const reviewerEmail = review?.booking?.user?.email ?? '';
  const petName = review?.booking?.pet?.name ?? 'a pet';

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Reviews" />
      <div className="p-8">
        {isLoading && (
          <p className="text-sm text-gray-500">Loading reviews...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Failed to load reviews:{' '}
            {error instanceof Error ? error.message : String(error)}
          </p>
        )}

        {!isLoading && !error && (!reviews || reviews.length === 0) && (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}

        {!isLoading && !error && review && (
          <div className="rounded-2xl border border-sky-200 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
                🐱
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {reviewerName}
                </p>
                {reviewerEmail && (
                  <p className="text-xs text-gray-400">&lt;{reviewerEmail}&gt;</p>
                )}
              </div>
            </div>

            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < review.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }
                />
              ))}
            </div>

            <h3 className="mb-2 text-sm font-bold text-gray-800">
              Review for {petName}
            </h3>
            <div className="mb-16 space-y-1 text-sm text-gray-600">
              {review.comment ? (
                <p>{review.comment}</p>
              ) : (
                <p className="italic text-gray-400">No comment left.</p>
              )}
            </div>

            {replying && (
              <div className="mb-4">
                <textarea
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                  rows={3}
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setReplying(false);
                      setReplyText('');
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                    className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-40"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplying((r) => !r)}
                className="rounded-lg bg-amber-200 px-6 py-2 text-sm font-semibold text-gray-800 hover:bg-amber-300"
              >
                Reply
              </button>
              <button
                onClick={nextReview}
                className="rounded-lg bg-amber-200 px-6 py-2 text-sm font-semibold text-gray-800 hover:bg-amber-300"
                aria-label="Next review"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showSuccess} onClose={closeSuccess} title="Reply Sent">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 size={44} className="text-emerald-500" />
          <p className="text-sm text-gray-600">
            Your reply to{' '}
            <span className="font-semibold text-gray-800">{reviewerName}</span> has
            been sent successfully.
          </p>
          <button
            onClick={closeSuccess}
            className="mt-2 rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}