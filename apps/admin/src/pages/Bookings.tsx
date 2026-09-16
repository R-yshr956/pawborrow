import { useState } from "react";

import Header from "../components/Header";
import Modal from "../components/Modal";

import {
  useAdminBookings,
  useUpdateBooking,
  useCurrentTime,
  getTodayDate,
  getBookingDisplayStatus,
  useRescheduleBooking,
  type AdminBooking,
} from "@repo/api";

function MiniBars({
  heights,
  highlightColor,
}: {
  heights: number[];
  highlightColor: string;
}) {
  return (
    <div className="flex h-9 items-end gap-1">
      {heights.map((height, index) => (
        <div
          key={index}
          className="w-1.5 rounded-sm"
          style={{
            height: `${height}%`,
            backgroundColor:
              index === heights.length - 2 ? highlightColor : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}

function CircularProgress({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) {
  const size = 44;
  const stroke = 5;

  const radius = (size - stroke) / 2;

  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F1F1F1"
        strokeWidth={stroke}
        fill="none"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-200 text-yellow-800",
  confirmed: "bg-emerald-200 text-emerald-700",
  cancelled: "bg-rose-200 text-rose-700",
  completed: "bg-gray-200 text-gray-700",
};

function formatTime(time: string | null) {
  if (!time) {
    return "—";
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time;
  }

  const suffix = hours >= 12 ? "PM" : "AM";

  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function calculateEndTime(startTime: string | null, durationMinutes: number) {
  if (!startTime) {
    return "—";
  }

  const [hours, minutes] = startTime.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return "—";
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  date.setMinutes(date.getMinutes() + durationMinutes);

  const endTime = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

  return formatTime(endTime);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getBookerName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
) {
  const name = [firstName, lastName].filter(Boolean).join(" ");

  return name || email || "Unknown customer";
}

export default function Bookings() {
  const { data: bookings, isLoading, error } = useAdminBookings();

  const updateBooking = useUpdateBooking();

  const rescheduleBooking = useRescheduleBooking();

  const now = useCurrentTime();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected =
    bookings?.find((booking) => booking.booking_id === selectedId) ?? null;

  const totalBookings = bookings?.length ?? 0;

  const pendingBookings =
    bookings?.filter((booking) => booking.status.toLowerCase() === "pending")
      .length ?? 0;

  const today = getTodayDate();

  const todayBookings =
    bookings?.filter((booking) => booking.reservation_date === today) ?? [];

  const inProgressBookings =
    bookings?.filter(
      (booking) => getBookingDisplayStatus(booking, now) === "in_progress",
    ) ?? [];

  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState("");

  const [rescheduleTime, setRescheduleTime] = useState("09:00");

  const [rescheduleDuration, setRescheduleDuration] = useState(60);

  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(
    null,
  );

  function handleOpenReschedule(booking: AdminBooking) {
    setRescheduleBookingId(booking.booking_id);

    setRescheduleDate(booking.reservation_date);

    setRescheduleTime(booking.time_slot ?? "09:00");

    setRescheduleDuration(booking.duration_minutes ?? 60);

    setRescheduleOpen(true);
  }

  function handleCloseReschedule() {
    setRescheduleOpen(false);

    setRescheduleBookingId(null);
  }

  function handleDecreaseDuration() {
    setRescheduleDuration((current) => (current <= 60 ? 60 : current - 15));
  }

  function handleIncreaseDuration() {
    setRescheduleDuration((current) => current + 15);
  }

  function handleReschedule() {
    if (rescheduleBookingId === null) {
      return;
    }

    if (!rescheduleDate || !rescheduleTime) {
      return;
    }

    if (rescheduleDuration < 60 || rescheduleDuration % 15 !== 0) {
      return;
    }

    rescheduleBooking.mutate(
      {
        bookingId: rescheduleBookingId,
        reservationDate: rescheduleDate,
        timeSlot: rescheduleTime,
        durationMinutes: rescheduleDuration,
      },
      {
        onSuccess: () => {
          handleCloseReschedule();
          setSelectedId(null);
        },
      },
    );
  }

  function handleStatusChange(status: "confirmed" | "cancelled" | "completed") {
    if (!selected) {
      return;
    }

    updateBooking.mutate(
      {
        bookingId: selected.booking_id,
        status,
      },
      {
        onSuccess: () => {
          setSelectedId(null);
        },
      },
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Bookings" />

      <div className="p-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-base font-bold text-gray-800">Bookings</h2>

          <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <MiniBars
                heights={[35, 55, 40, 90, 60]}
                highlightColor="#EC4899"
              />

              <div>
                <p className="text-xs text-gray-500">Total Bookings</p>

                <p className="text-lg font-bold text-gray-800">
                  {totalBookings}

                  <span className="text-xs font-normal text-gray-400">
                    {" "}
                    Total
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MiniBars
                heights={[30, 45, 35, 70, 50]}
                highlightColor="#34D399"
              />

              <div>
                <p className="text-xs text-gray-500">Online Bookings</p>

                <p className="text-lg font-bold text-gray-800">
                  {totalBookings}

                  <span className="text-xs font-normal text-gray-400">
                    {" "}
                    Total
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CircularProgress
                percent={
                  totalBookings > 0
                    ? (pendingBookings / totalBookings) * 100
                    : 0
                }
                color="#34D399"
              />

              <div>
                <p className="text-xs text-gray-500">Pending Approval</p>

                <p className="text-lg font-bold text-gray-800">
                  {pendingBookings}
                </p>
              </div>
            </div>
          </div>

          <h3 className="mb-4 text-sm font-bold text-gray-800">
            Upcoming Appointments
          </h3>

          {isLoading && (
            <p className="py-8 text-center text-sm text-gray-400">
              Loading bookings...
            </p>
          )}

          {error && (
            <p className="py-8 text-center text-sm text-red-500">
              Failed to load bookings:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
          )}

          {!isLoading && !error && bookings && bookings.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              No bookings found.
            </p>
          )}

          {!isLoading && !error && bookings && bookings.length > 0 && (
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => {
                const pet = booking.pet;

                const profile = booking.user_profile;

                const booker = getBookerName(
                  profile?.first_name,
                  profile?.last_name,
                  profile?.email,
                );

                const status = booking.status.toLowerCase();

                return (
                  <div
                    key={booking.booking_id}
                    className="rounded-xl border border-gray-100 p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {pet?.image_url ? (
                          <img
                            src={pet.image_url}
                            alt={pet.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200" />
                        )}

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {pet?.name ?? "Unknown pet"}
                          </p>

                          <p className="text-xs text-sky-500">
                            Booker: {booker}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          statusStyles[status] ?? "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mb-3 flex justify-between text-xs">
                      <div>
                        <p className="text-sky-500">Session Start</p>

                        <p className="text-gray-500">
                          {formatTime(booking.time_slot)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sky-500">Session End</p>

                        <p className="text-gray-500">
                          {calculateEndTime(
                            booking.time_slot,
                            booking.duration_minutes,
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="mb-3 text-xs text-gray-400">
                      {booking.reservation_date}
                    </p>

                    <button
                      onClick={() => setSelectedId(booking.booking_id)}
                      className="w-full rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold text-gray-800">
              In progress
            </h3>

            {inProgressBookings.length === 0 ? (
              <p className="text-xs text-gray-400">
                No sessions currently in progress.
              </p>
            ) : (
              <div className="space-y-2">
                {inProgressBookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="rounded-lg border border-emerald-100 bg-emerald-50 p-3"
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      {booking.pet?.name ?? "Unknown pet"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {formatTime(booking.time_slot)} –{" "}
                      {calculateEndTime(
                        booking.time_slot,
                        booking.duration_minutes,
                      )}
                    </p>

                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      Currently in progress
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Today</h3>

            {todayBookings.length === 0 ? (
              <p className="text-xs text-gray-400">
                No sessions scheduled for today.
              </p>
            ) : (
              <div className="space-y-2">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {booking.pet?.name ?? "Unknown pet"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatTime(booking.time_slot)} –{" "}
                          {calculateEndTime(
                            booking.time_slot,
                            booking.duration_minutes,
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          statusStyles[booking.status.toLowerCase()] ??
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={selected !== null}
        onClose={() => setSelectedId(null)}
        title={
          selected ? `${selected.pet?.name ?? "Pet"}'s Appointment` : undefined
        }
      >
        {selected && (
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              {selected.pet?.image_url ? (
                <img
                  src={selected.pet.image_url}
                  alt={selected.pet.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200" />
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {selected.pet?.name ?? "Unknown pet"}
                </p>

                <p className="text-sm text-sky-500">
                  Booker:{" "}
                  {getBookerName(
                    selected.user_profile?.first_name,
                    selected.user_profile?.last_name,
                    selected.user_profile?.email,
                  )}
                </p>
              </div>

              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[selected.status.toLowerCase()] ??
                  "bg-gray-200 text-gray-700"
                }`}
              >
                {selected.status}
              </span>
            </div>


            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
              <div>
                <p className="text-xs text-sky-500">Session Start</p>

                <p className="font-medium text-gray-700">
                  {formatTime(selected.time_slot)}
                </p>
              </div>

              <div>
                <p className="text-xs text-sky-500">Session End</p>

                <p className="font-medium text-gray-700">
                  {calculateEndTime(
                    selected.time_slot,
                    selected.duration_minutes,
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                Booking Date
              </p>

              <p className="text-sm text-gray-500">
                {selected.reservation_date}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                Duration
              </p>

              <p className="text-sm text-gray-500">
                {formatDuration(selected.duration_minutes)}
              </p>
            </div>


            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                Pet
              </p>

              <p className="text-sm text-gray-500">
                {selected.pet?.name ?? "Unknown pet"}
              </p>

              <p className="text-xs text-gray-400">
                {selected.pet?.breed ?? "Unknown breed"}
              </p>
            </div>


            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                Customer Email
              </p>

              <p className="text-sm text-gray-500">
                {selected.user_profile?.email ?? "No email"}
              </p>
            </div>

                        <div className="flex gap-2 pt-2">
              {selected.status.toLowerCase() === "pending" && (
                <button
                  onClick={() => handleStatusChange("confirmed")}
                  disabled={updateBooking.isPending}
                  className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateBooking.isPending ? "Updating..." : "Approve"}
                </button>
              )}

              {selected.status.toLowerCase() === "confirmed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updateBooking.isPending}
                  className="flex-1 rounded-lg bg-gray-700 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateBooking.isPending ? "Updating..." : "Mark Completed"}
                </button>
              )}

              <button
                onClick={() => handleOpenReschedule(selected)}
                disabled={
                  updateBooking.isPending || rescheduleBooking.isPending
                }
                className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reschedule
              </button>

              {selected.status.toLowerCase() !== "cancelled" &&
                selected.status.toLowerCase() !== "completed" && (
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={updateBooking.isPending}
                    className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateBooking.isPending ? "Updating..." : "Cancel"}
                  </button>
                )}
            </div>
          </div>
        )}
      </Modal>



      <Modal
        isOpen={rescheduleOpen}
        onClose={handleCloseReschedule}
        title="Reschedule Appointment"
      >
        <div className="space-y-5">

          <div>
            <label
              htmlFor="reschedule-date"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Reservation Date
            </label>

            <input
              id="reschedule-date"
              type="date"
              value={rescheduleDate}
              onChange={(event) => setRescheduleDate(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label
              htmlFor="reschedule-time"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Start Time
            </label>

            <input
              id="reschedule-time"
              type="time"
              value={rescheduleTime}
              onChange={(event) => setRescheduleTime(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Duration
            </label>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
              <button
                type="button"
                onClick={handleDecreaseDuration}
                disabled={rescheduleDuration <= 60}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-lg text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <span className="font-semibold text-gray-700">
                {formatDuration(rescheduleDuration)}
              </span>

              <button
                type="button"
                onClick={handleIncreaseDuration}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-lg text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Minimum 1 hour. Additional time is added in 15-minute increments.
            </p>
          </div>


          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
              New Schedule
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-sky-500">Date</p>

                <p className="text-sm font-medium text-gray-700">
                  {rescheduleDate || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-sky-500">Duration</p>

                <p className="text-sm font-medium text-gray-700">
                  {formatDuration(rescheduleDuration)}
                </p>
              </div>

              <div>
                <p className="text-xs text-sky-500">Start</p>

                <p className="text-sm font-medium text-gray-700">
                  {formatTime(rescheduleTime)}
                </p>
              </div>

              <div>
                <p className="text-xs text-sky-500">End</p>

                <p className="text-sm font-medium text-gray-700">
                  {calculateEndTime(rescheduleTime, rescheduleDuration)}
                </p>
              </div>
            </div>
          </div>


          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCloseReschedule}
              disabled={rescheduleBooking.isPending}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReschedule}
              disabled={
                rescheduleBooking.isPending ||
                !rescheduleDate ||
                !rescheduleTime ||
                rescheduleDuration < 60 ||
                rescheduleDuration % 15 !== 0
              }
              className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rescheduleBooking.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
