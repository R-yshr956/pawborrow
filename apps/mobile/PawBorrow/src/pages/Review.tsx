import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { ChevronLeft, Star } from "lucide-react";
import { useCreateReview } from "@repo/api";

import { getPetImage, handlePetImageError } from "../utils/petImage";

type ReviewLocationState = {
  booking?: {
    booking_id: number;
    pet: {
      name: string;
      breed: string | null;
      image_url: string | null;
    } | null;
  };
};

const Review = () => {
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as ReviewLocationState | null;
  const booking = locationState?.booking;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { mutate: submitReview, isPending, error } = useCreateReview();

  function handleSubmit() {
    setValidationError("");
    setSuccessMessage("");

    if (rating === 0) {
      setValidationError("Please select a rating before submitting.");
      return;
    }

    if (!bookingId) {
      setValidationError("Booking ID is missing.");
      return;
    }

    const numericBookingId = Number(bookingId);

    if (!Number.isInteger(numericBookingId) || numericBookingId <= 0) {
      setValidationError("The booking ID is invalid.");
      return;
    }

    submitReview(
      {
        booking_id: numericBookingId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Your review was submitted successfully!");

          window.setTimeout(() => {
            navigate("/my-bookings", {
              replace: true,
              state: {
                reviewSubmitted: true,
              },
            });
          }, 1200);
        },

        onError: (submitError) => {
          console.error("Failed to submit review:", submitError);
        },
      },
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
    <IonPage>
      <IonContent
        fullscreen
        scrollY={true}
        className="
          [--background:#ffffff]
          [--padding-bottom:calc(100px+env(safe-area-inset-bottom))]
        "
      >
        <main
          className="
            mx-auto box-border min-h-full w-full max-w-[480px]
            px-[clamp(16px,4vw,24px)]
            pb-[calc(100px+env(safe-area-inset-bottom))]
            font-poppins
          "
        >
          <header
            className="
              relative mb-6 mt-[clamp(16px,5vh,30px)]
              flex items-center justify-center
            "
          >
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate("/my-bookings")}
              disabled={isPending}
              className="
                absolute left-0 flex h-9 w-9
                items-center justify-center
                rounded-full border-0 bg-froly-400
                text-white shadow-sm
                transition duration-200
                active:scale-95 active:bg-froly-500
                disabled:cursor-not-allowed
                disabled:opacity-60
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-froly-400
              "
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <h1
              className="
                m-0 font-cherry text-3xl
                leading-none text-froly-400
              "
            >
              Leave a Review
            </h1>
          </header>

          <section
            className="
              rounded-[20px] border
              border-alabaster-100 bg-white p-5
              shadow-[0_8px_24px_rgba(22,34,51,0.08)]
            "
          >
            <p
              className="
                mb-[18px] mt-0 text-center
                text-sm leading-6 text-alabaster-600
              "
            >
              Tell us about your experience with{" "}
              <strong className="font-semibold text-alabaster-900">
                {booking?.pet?.name ?? "this pet"}
              </strong>
              .
            </p>

            {booking?.pet && (
              <div
                className="
                  mb-6 flex items-center gap-3.5
                  rounded-[14px] bg-buttermilk-50 p-3
                "
              >
                <img
                  src={getPetImage(booking.pet.image_url)}
                  alt={booking.pet.name}
                  onError={handlePetImageError}
                  className="
                    h-16 w-16 shrink-0 rounded-xl
                    bg-white object-cover
                  "
                />

                <div className="min-w-0 flex-1">
                  <h2
                    className="
                      mb-1 mt-0 truncate
                      text-base font-bold text-alabaster-950
                    "
                  >
                    {booking.pet.name}
                  </h2>

                  <p
                    className="
                      m-0 truncate text-xs text-alabaster-600
                    "
                  >
                    {booking.pet.breed ?? "Breed not specified"}
                  </p>
                </div>
              </div>
            )}

            <fieldset
              disabled={isPending}
              className="
                mb-[22px] border-0 p-0 text-center
              "
            >
              <legend
                className="
                  mb-2.5 w-full
                  text-sm font-bold text-alabaster-950
                "
              >
                Your rating
              </legend>

              <div
                className="
                  flex items-center justify-center gap-1
                "
                aria-label="Select a rating"
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isSelected = starValue <= rating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      aria-label={`Rate ${starValue} star${
                        starValue > 1 ? "s" : ""
                      }`}
                      aria-pressed={rating === starValue}
                      onClick={() => {
                        setRating(starValue);
                        setValidationError("");
                      }}
                      className="
                        flex items-center justify-center
                        rounded-lg border-0 bg-transparent p-1
                        text-buttermilk-500
                        transition duration-150
                        hover:scale-110
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        focus-visible:outline-2
                        focus-visible:outline-offset-1
                        focus-visible:outline-buttermilk-400
                      "
                    >
                      <Star
                        size={36}
                        strokeWidth={1.8}
                        fill={isSelected ? "currentColor" : "none"}
                      />
                    </button>
                  );
                })}
              </div>

              <p
                className="
                  mb-0 mt-2 text-xs text-alabaster-400
                "
              >
                {rating === 0
                  ? "Tap a star to rate"
                  : `${rating} out of 5 stars`}
              </p>
            </fieldset>

            <label
              htmlFor="mobile-review-comment"
              className="
                mb-2 block text-[13px]
                font-bold text-alabaster-950
              "
            >
              Your review
            </label>

            <textarea
              id="mobile-review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="How was your experience?"
              maxLength={1000}
              disabled={isPending}
              className="
                min-h-[130px] w-full resize-y
                box-border rounded-[13px]
                border border-alabaster-300 bg-white
                p-[13px] font-poppins text-sm
                text-alabaster-950 outline-none
                placeholder:text-alabaster-400
                transition duration-200
                focus:border-froly-400
                focus:ring-4 focus:ring-froly-100
                disabled:cursor-not-allowed
                disabled:bg-alabaster-50
                disabled:opacity-60
              "
            />

            <p
              className="
                mx-0 mb-0 mt-1.5
                text-right text-[11px] text-alabaster-400
              "
            >
              {comment.length}/1000
            </p>

            {displayedError && (
              <p
                className="
                  mb-0 mt-3.5 text-center
                  text-[13px] leading-5 text-froly-700
                "
                role="alert"
              >
                {displayedError}
              </p>
            )}

            {successMessage && (
              <p
                className="
                  mb-0 mt-3.5 text-center
                  text-[13px] leading-5 text-[#16834a]
                "
                role="status"
              >
                {successMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === 0 || isPending || Boolean(successMessage)}
              className="
                mt-[18px] min-h-12 w-full
                rounded-[13px] border-0
                bg-froly-400 px-[18px] py-[13px]
                text-sm font-bold text-white
                shadow-[0_6px_16px_rgba(245,120,123,0.25)]
                transition duration-200
                hover:bg-froly-500
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-55
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-froly-400
              "
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Review;
