import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useCreateReview } from "@repo/api";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "@/styles/Review.css";

interface LocationState {
  booking?: {
    booking_id: number;
    pet?: {
      name?: string;
      breed?: string;
      image_url?: string;
    };
  };
}

export default function Review() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as LocationState | null) ?? {};
  const booking = state.booking;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    mutate: submitReview,
    isPending,
    error,
  } = useCreateReview();

  function handleSubmit() {
    setValidationError("");

    console.log("Submit clicked:", {
      bookingId,
      rating,
      comment,
    });

    if (rating === 0) {
      setValidationError("Please select a rating before submitting.");
      console.error("Submission stopped: no rating selected.");
      return;
    }

    if (!bookingId) {
      setValidationError("Booking ID is missing.");
      console.error("Submission stopped: missing booking ID.");
      return;
    }

    const numericBookingId = Number(bookingId);

    if (!Number.isInteger(numericBookingId) || numericBookingId <= 0) {
      setValidationError("The booking ID is invalid.");
      console.error("Submission stopped: invalid booking ID.", bookingId);
      return;
    }

    submitReview(
      {
        booking_id: numericBookingId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          console.log("Review successfully inserted:", data);
          navigate("/bookings", {
            replace: true,
            state: {
              reviewSubmitted: true,
            },
          });
        },

        onError: (submitError) => {
          console.error("Review insertion failed:", submitError);
        },
      }
    );
  }

  const displayedError =
    validationError ||
    (error instanceof Error
      ? error.message
      : error
        ? "Something went wrong while submitting your review."
        : "");

  return (
    <>
      <Navbar />

      <main className="review-page">
        <div className="review-card">
          <h1>Leave a Review</h1>

          <p className="review-subtext">
            Tell us about your experience booking{" "}
            {booking?.pet?.name ?? "this pet"}.
          </p>

          {booking?.pet && (
            <div className="review-pet-preview">
              <img
                src={
                  booking.pet.image_url?.trim()
                    ? booking.pet.image_url
                    : "/images/pet-placeholder.jpg"
                }
                alt={booking.pet.name ?? "Pet"}
              />

              <div>
                <h4>{booking.pet.name ?? "Pet"}</h4>
                {booking.pet.breed && <p>{booking.pet.breed}</p>}
              </div>
            </div>
          )}

          <div className="review-stars" aria-label="Choose a rating">
            {[1, 2, 3, 4, 5].map((star) => {
              const activeRating = hoverRating || rating;
              const isSelected = rating === star;

              return (
                <button
                  key={star}
                  type="button"
                  className="review-star-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(star);
                    setValidationError("");
                  }}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={isSelected}
                  disabled={isPending}
                >
                  <Star
                    size={32}
                    fill={activeRating >= star ? "#f16c6c" : "none"}
                    color="#f16c6c"
                  />
                </button>
              );
            })}
          </div>

          <label className="review-label" htmlFor="review-comment">
            Your review
          </label>

          <textarea
            id="review-comment"
            className="review-textarea"
            placeholder="How was your experience?"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={isPending}
            maxLength={1000}
          />

          {displayedError && (
            <p className="review-error" role="alert">
              {displayedError}
            </p>
          )}

          <button
            type="button"
            className="review-submit-btn"
            onClick={handleSubmit}
            disabled={rating === 0 || isPending}
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}