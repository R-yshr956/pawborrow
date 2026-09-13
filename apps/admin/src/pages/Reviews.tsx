import { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Modal from '../components/Modal';

interface Review {
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string[];
}

// Placeholder reviews — swap for real review data once it exists.
const reviews: Review[] = [
  {
    name: 'Juan Omoya',
    email: 'jmvuayan@yahoo.com',
    rating: 5,
    title: 'Wonderful Experience',
    body: [
      'I had a fantastic day with Mitski today! Very energetic and fun to have around, will probably book again next week.',
      'P.S',
      'Take care Mitski!!!',
    ],
  },
  {
    name: 'Elaine Jean',
    email: 'elaine.jean@example.com',
    rating: 5,
    title: 'Would book again',
    body: [
      'Booking was simple and the pet was clearly well taken care of. Really relaxing weekend with a great companion.',
    ],
  },
  {
    name: 'Carlos Reyes',
    email: 'carlos.reyes@example.com',
    rating: 4,
    title: 'Good first experience',
    body: [
      'Everything went smoothly, just wish the session was a little longer. Will try again with a different pet next time.',
    ],
  },
];

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const review = reviews[index];

  function nextReview() {
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

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Reviews" />
      <div className="p-8">
        <div className="rounded-2xl border border-sky-200 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
              🐱
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{review.name}</p>
              <p className="text-xs text-gray-400">&lt;{review.email}&gt;</p>
            </div>
          </div>

          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>

          <h3 className="mb-2 text-sm font-bold text-gray-800">{review.title}</h3>
          <div className="mb-16 space-y-1 text-sm text-gray-600">
            {review.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
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
      </div>

      <Modal isOpen={showSuccess} onClose={closeSuccess} title="Reply Sent">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 size={44} className="text-emerald-500" />
          <p className="text-sm text-gray-600">
            Your reply to <span className="font-semibold text-gray-800">{review.name}</span> has
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