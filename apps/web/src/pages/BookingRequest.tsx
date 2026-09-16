import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createBooking,
  useAuth,
  useProfile,
} from "@repo/api";
import type { Pet } from "@repo/api";
import BookingModal from "@/components/ui/BookingModal";

type LocationState = {
  pet: Pet;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
function calculateEndTime(
  startTime: string,
  durationMinutes: number,
) {
  const [hour, minute] = startTime.split(":").map(Number);

  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  date.setMinutes(
    date.getMinutes() + durationMinutes,
  );

  const endHour = String(date.getHours()).padStart(2, "0");
  const endMinute = String(date.getMinutes()).padStart(2, "0");

  return `${endHour}:${endMinute}`;
}

function formatTime(time: string) {
  return new Date(
    `1970-01-01T${time}`,
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingRequest() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    data: profile,
    isLoading: profileLoading,
  } = useProfile();


  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [startTime, setStartTime] =
    useState("09:00");

  const [durationMinutes, setDurationMinutes] =
    useState(60);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const state =
    location.state as LocationState | null;


  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [
    user,
    authLoading,
    navigate,
  ]);


  if (!state?.pet) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-6 py-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f5ed] text-2xl">
            🐾
          </div>

          <h2 className="mt-5 font-serif text-2xl font-medium">
            No pet selected
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please select a pet before making a
            booking.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/pets")
            }
            className="mt-6 rounded-xl bg-[#879b7b] px-6 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#748a68]"
          >
            Back to Pets
          </button>

        </div>
      </div>
    );
  }


  if (
    authLoading ||
    profileLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#879b7b] border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const pet = state.pet;

  const firstName =
    profile?.first_name ?? "";

  const lastName =
    profile?.last_name ?? "";

  const email =
    profile?.email ??
    user.email ??
    "";


  const hourlyRate =
    pet.hourlyRate;

  const total =
    hourlyRate *
    (durationMinutes / 60);

  const endTime =
    calculateEndTime(
      startTime,
      durationMinutes,
    );

  function handleDecreaseDuration() {
    setDurationMinutes(
      (current) => {
        if (current <= 60) {
          return 60;
        }

        return current - 15;
      },
    );
  }

  function handleIncreaseDuration() {
    setDurationMinutes(
      (current) =>
        current + 15,
    );
  }


  async function handleBooking() {
    setError("");

    if (!user) {
      setError(
        "You must be signed in to make a booking.",
      );

      navigate("/login");
      return;
    }

    if (!selectedDate) {
      setError(
        "Please select a reservation date.",
      );

      return;
    }

    if (!firstName.trim()) {
      setError(
        "Your account is missing your first name. Please update your profile.",
      );

      return;
    }

    if (!lastName.trim()) {
      setError(
        "Your account is missing your last name. Please update your profile.",
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Your account is missing an email address.",
      );

      return;
    }

    if (
      durationMinutes < 60 ||
      durationMinutes % 15 !== 0
    ) {
      setError(
        "Booking duration must be at least 1 hour and use 15-minute increments.",
      );

      return;
    }

    try {
      setLoading(true);

      const booking =
        await createBooking({
          pet_id: pet.id,
          reservation_date:
            formatDate(selectedDate),
          time_slot: startTime,
          duration_minutes:
            durationMinutes,
        });


      navigate("/payment", {
        state: {
          bookingId:
            booking.booking_id,

          pet,

          durationMinutes,

          startTime,

          endTime,

          hourlyRate,

          total,

          reservationDate:
            formatDate(selectedDate),

          contact: {
            firstName,
            lastName,
            email,
            message,
          },
        },
      });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create booking.",
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fafafa] px-6 py-10">

      <div className="mx-auto grid w-full max-w-[1100px] overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:grid-cols-2">

        <section className="p-10 max-md:p-7">

          <h1 className="font-serif text-[30px] font-medium max-md:text-[25px]">
            Book {pet.name}
          </h1>

          <p className="mt-2.5 text-sm leading-relaxed text-gray-500">
            Choose your preferred date and booking
            duration for your pet companion.
          </p>

          <div className="mt-7 rounded-[14px] border border-[#e5e5e5] p-3.5">

            <div className="flex items-center gap-3.5">

              {pet.image ? (
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f5ed] text-xl">
                  🐾
                </div>
              )}

              <div>

                <h2 className="font-semibold">
                  {pet.name}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {pet.breed ||
                    "Unknown breed"}
                </p>

                <p className="mt-1 text-xs text-[#708464]">
                  {pet.category}
                </p>

              </div>

            </div>

          </div>

          <div className="mt-9">

            <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
              <span>
                Reservation Date
              </span>
            </div>

            <div className="w-full max-w-[420px] rounded-[18px] border border-[#e5e5e5] bg-white p-[18px]">

              <input
                type="date"
                min={formatDate(
                  new Date(),
                )}
                value={
                  selectedDate
                    ? formatDate(
                        selectedDate,
                      )
                    : ""
                }
                onChange={(
                  event,
                ) => {
                  if (
                    event.target
                      .value
                  ) {
                    setSelectedDate(
                      new Date(
                        `${event.target.value}T00:00:00`,
                      ),
                    );
                  }
                }}
                className="h-11 w-full rounded-xl border border-[#ddd] bg-white px-3.5 text-sm outline-none transition focus:border-[#879b7b] focus:ring-2 focus:ring-[#879b7b]/10"
              />

              {selectedDate && (
                <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#f7faf5] px-3.5 py-3 text-xs">

                  <span className="text-gray-500">
                    Selected date
                  </span>

                  <strong className="text-[#4d6044]">
                    {selectedDate.toLocaleDateString(
                      "en-US",
                      {
                        month:
                          "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </strong>

                </div>
              )}

            </div>

          </div>

          <div className="mt-9">

            <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
              <span>
                Your Information
              </span>
            </div>

            <div className="rounded-[18px] border border-[#e5e5e5] bg-[#fafbf9] p-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {firstName}{" "}
                    {lastName}
                  </p>

                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#879b7b] text-sm font-bold text-white">
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </div>

              </div>

              <div className="mt-4 border-t border-[#e5e5e5] pt-4">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-gray-700">
                  {email}
                </p>

              </div>

              <p className="mt-4 text-xs leading-5 text-gray-400">
                Your contact information comes
                from your PawBorrow account.
              </p>

            </div>

          </div>

        </section>

        <section className="bg-[#fcfcfc] p-10 max-md:p-7">

          <h2 className="mb-6 font-serif text-[25px] font-medium">
            Booking Details
          </h2>

          <div className="mb-[18px]">

            <label
              htmlFor="startTime"
              className="mb-1.5 block text-xs font-semibold uppercase text-[#333]"
            >
              Start Time
            </label>

            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(
                event,
              ) =>
                setStartTime(
                  event.target
                    .value,
                )
              }
              className="box-border h-[46px] w-full rounded-xl border border-[#ddd] bg-white px-3.5 text-sm outline-none transition focus:border-[#879b7b] focus:ring-2 focus:ring-[#879b7b]/10"
            />

          </div>


          <div className="mb-[18px]">

            <label className="mb-1.5 block text-xs font-semibold uppercase text-[#333]">
              Duration
            </label>

            <div className="flex h-[46px] w-full items-center justify-between overflow-hidden rounded-xl border border-[#ddd] bg-white">

              <button
                type="button"
                onClick={
                  handleDecreaseDuration
                }
                disabled={
                  durationMinutes <=
                  60
                }
                className="h-full w-[50px] text-xl transition hover:bg-[#f0f5ed] disabled:cursor-not-allowed disabled:text-gray-300"
              >
                −
              </button>

              <span className="text-sm font-medium">
                {formatDuration(
                  durationMinutes,
                )}
              </span>

              <button
                type="button"
                onClick={
                  handleIncreaseDuration
                }
                className="h-full w-[50px] text-xl transition hover:bg-[#f0f5ed]"
              >
                +
              </button>

            </div>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Minimum booking duration is 1
              hour. Additional time can be
              added in 15-minute increments.
            </p>

          </div>

          <h2 className="mb-6 mt-8 font-serif text-[25px] font-medium">
            Additional Information
          </h2>

          <div className="mb-[18px]">

            <label
              htmlFor="message"
              className="mb-1.5 block text-xs font-semibold uppercase text-[#333]"
            >
              Message
            </label>

            <textarea
              id="message"
              value={message}
              onChange={(
                event,
              ) =>
                setMessage(
                  event.target
                    .value,
                )
              }
              placeholder="Anything we should know?"
              rows={4}
              className="min-h-[100px] w-full resize-y rounded-xl border border-[#ddd] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#879b7b] focus:ring-2 focus:ring-[#879b7b]/10"
            />

          </div>

          <div className="my-2.5 mb-[22px] rounded-[14px] bg-[#f5f7f3] p-4">

            <div className="flex justify-between py-[7px] text-[13px]">

              <span className="text-gray-500">
                Hourly Rate
              </span>

              <strong>
                ₱
                {hourlyRate.toLocaleString()}
              </strong>

            </div>

            <div className="flex justify-between py-[7px] text-[13px]">

              <span className="text-gray-500">
                Duration
              </span>

              <strong>
                {formatDuration(
                  durationMinutes,
                )}
              </strong>

            </div>

            <div className="flex justify-between py-[7px] text-[13px]">

              <span className="text-gray-500">
                Start Time
              </span>

              <strong>
                {formatTime(
                  startTime,
                )}
              </strong>

            </div>

            <div className="flex justify-between py-[7px] text-[13px]">

              <span className="text-gray-500">
                End Time
              </span>

              <strong>
                {endTime}
              </strong>

            </div>

            <div className="mt-2 flex justify-between border-t border-[#ddd] pt-3 text-[13px]">

              <span className="text-gray-500">
                Calculation
              </span>

              <strong>
                ₱
                {hourlyRate.toLocaleString()}
                {" × "}
                {durationMinutes / 60}
              </strong>

            </div>


            <div className="mt-1 flex justify-between border-t border-[#ddd] pt-3.5 text-base">

              <strong>
                Total
              </strong>

              <strong className="text-[#708464]">
                ₱
                {total.toLocaleString()}
              </strong>

            </div>

          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}


          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              disabled={loading}
              className="h-[50px] flex-1 rounded-xl border border-[#ddd] bg-white text-xs font-semibold uppercase transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Back
            </button>

            <button
              type="button"
              onClick={
                handleBooking
              }
              disabled={loading}
              className="h-[50px] flex-[2] rounded-xl bg-[#879b7b] text-xs font-semibold uppercase text-white transition hover:bg-[#748a68] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Booking..."
                : "Continue to Payment"}
            </button>

          </div>

        </section>

        <BookingModal />

      </div>
    </div>
  );
}