import { useNavigate } from "react-router-dom";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { calendarOutline, timeOutline, starOutline } from "ionicons/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBookings, updateBookingStatus, type Booking } from "@repo/api";

import { getPetImage, handlePetImageError } from "../utils/petImage";
import { PawPrint } from 'lucide-react';

function formatBookingDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatBookingTime(time: string | null) {
  if (!time) {
    return "Time not specified";
  }

  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText ?? "0");

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string) {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
      return "bg-buttermilk-100 text-rusty-nail-900";

    case "confirmed":
      return "bg-[#dff7e8] text-[#16834a]";

    case "completed":
      return "bg-charlotte-100 text-boston-blue-700";

    case "cancelled":
      return "bg-froly-100 text-froly-700";

    default:
      return "bg-alabaster-100 text-alabaster-700";
  }
}

function canCancelBooking(booking: Booking) {
  const status = booking.status.toLowerCase();

  return status === "pending" || status === "confirmed";
}

function canReviewBooking(_booking: Booking) {
  return true;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useBookings();

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) =>
      updateBookingStatus(bookingId, "cancelled"),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["pets"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-bookings"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });

  function handleCancelBooking(bookingId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    cancelBookingMutation.mutate(bookingId);
  }

  function handleReviewBooking(booking: Booking) {
    navigate(`/review/${booking.booking_id}`, {
      state: {
        booking: {
          booking_id: booking.booking_id,
          pet: booking.pet,
        },
      },
    });
  }

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
            pt-[clamp(16px,4vw,24px)]
            pb-[calc(100px+env(safe-area-inset-bottom))]
            font-poppins
          "
        >
          <header
            className="
              relative mb-5
              flex items-center justify-center
              [@media(max-height:640px)]:mt-4 gap-2
            "
          >
            <PawPrint size={24} className="text-froly-400 shrink-0 translate-y-1" />
            <h1 className="m-0 font-cherry text-3xl font-semibold text-froly-400">
              My Bookings
            </h1>
          </header>

          {isLoading && (
            <div className="mt-[60px] text-center">
              <div
                className="
                  mx-auto mb-4 h-9 w-9 animate-spin
                  rounded-full border-4 border-froly-100
                  border-t-froly-400
                "
                aria-hidden="true"
              />

              <p className="m-0 text-sm text-alabaster-500">
                Loading your bookings...
              </p>
            </div>
          )}

          {isError && (
            <div
              className="
                mt-8 rounded-2xl border-2 border-froly-100
                bg-froly-50 px-5 py-8 text-center
              "
            >
              <p className="m-0 text-sm text-froly-700">
                {error instanceof Error
                  ? error.message
                  : "Failed to load your bookings."}
              </p>

              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="
                  mt-4 min-h-11 rounded-xl border-0
                  bg-froly-400 px-5 py-2
                  text-sm font-semibold text-white
                  transition duration-200
                  active:scale-95 active:bg-froly-500
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-froly-400
                "
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && bookings.length === 0 && (
            <div
              className="
                mt-[60px] rounded-2xl border-2
                border-alabaster-100 bg-alabaster-50
                px-5 py-10 text-center
              "
            >
              <p className="m-0 text-sm text-alabaster-500">
                You have no bookings yet.
              </p>
            </div>
          )}

          {!isLoading && !isError && bookings.length > 0 && (
            <section className="flex flex-col gap-3.5">
              {bookings.map((booking) => {
                const isCancelling =
                  cancelBookingMutation.isPending &&
                  cancelBookingMutation.variables === booking.booking_id;

                const showCancelButton = canCancelBooking(booking);
                const showReviewButton = canReviewBooking(booking);

                return (
                  <article
                    key={booking.booking_id}
                    className="
                      overflow-hidden rounded-2xl
                      border-2 border-alabaster-100
                      bg-white p-3.5
                      shadow-[0_8px_20px_rgba(22,34,51,0.08)]
                    "
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={getPetImage(booking.pet?.image_url)}
                        alt={booking.pet?.name ?? "Pet"}
                        loading="lazy"
                        onError={handlePetImageError}
                        className="
                          h-14 w-14 shrink-0 rounded-xl
                          bg-alabaster-50 object-cover
                        "
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            mb-0.5 mt-0 truncate
                            text-sm font-bold text-alabaster-950
                          "
                        >
                          {booking.pet?.name ?? "Unknown pet"}
                        </p>

                        <p
                          className="
                            mb-1.5 mt-0 truncate
                            text-xs text-alabaster-500
                          "
                        >
                          {booking.pet?.breed ?? "Breed not specified"}
                        </p>

                        <div
                          className="
                            mb-2 flex flex-wrap items-center
                            gap-x-3 gap-y-1
                            text-[11px] text-alabaster-600
                          "
                        >
                          <span className="inline-flex items-center gap-1">
                            <IonIcon
                              icon={calendarOutline}
                              className="shrink-0 text-sm text-froly-400"
                            />

                            <span>
                              {formatBookingDate(booking.reservation_date)}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <IonIcon
                              icon={timeOutline}
                              className="shrink-0 text-sm text-froly-400"
                            />

                            <span>{formatBookingTime(booking.time_slot)}</span>
                          </span>
                        </div>

                        {booking.duration_minutes && (
                          <p className="mb-2 mt-0 text-xs text-alabaster-500">
                            Duration: {booking.duration_minutes} minutes
                          </p>
                        )}

                        <span
                          className={`
                            inline-flex rounded-full px-2.5 py-1
                            text-[11px] font-bold
                            ${getStatusClasses(booking.status)}
                          `}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    {(showCancelButton || showReviewButton) && (
                      <div
                        className="
                          mt-3 flex items-center justify-end gap-2
                          border-t border-alabaster-100 pt-3
                        "
                      >
                        {showCancelButton && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelBooking(booking.booking_id)
                            }
                            disabled={isCancelling}
                            className="
                              inline-flex min-h-9 items-center justify-center
                              rounded-[10px] border border-froly-500
                              bg-white px-3 py-1.5
                              text-[11px] font-bold text-froly-600
                              transition duration-200
                              active:scale-95 active:bg-froly-50
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              focus-visible:outline-2
                              focus-visible:outline-offset-2
                              focus-visible:outline-froly-400
                            "
                          >
                            {isCancelling ? "Cancelling..." : "Cancel"}
                          </button>
                        )}

                        {showReviewButton && (
                          <button
                            type="button"
                            onClick={() => handleReviewBooking(booking)}
                            className="
                              inline-flex min-h-9 items-center
                              justify-center gap-1
                              rounded-[10px] border-0
                              bg-froly-400 px-3 py-1.5
                              text-[11px] font-bold text-white
                              transition duration-200
                              active:scale-95 active:bg-froly-500
                              focus-visible:outline-2
                              focus-visible:outline-offset-2
                              focus-visible:outline-froly-400
                            "
                          >
                            <IonIcon icon={starOutline} className="text-sm" />
                            Review
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}

          {cancelBookingMutation.isError && (
            <p
              className="
                mx-4 mt-4 rounded-xl bg-froly-50
                px-4 py-3 text-center
                text-sm text-froly-700
              "
              role="alert"
            >
              {cancelBookingMutation.error instanceof Error
                ? cancelBookingMutation.error.message
                : "Failed to cancel the booking."}
            </p>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;
