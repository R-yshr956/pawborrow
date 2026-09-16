import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "@repo/api";
import type { Pet } from "@repo/api";
import { Banknote } from "lucide-react";

type PaymentState = {
  bookingId: number;
  pet: Pet;

  durationMinutes: number;
  startTime: string;
  endTime: string;

  hourlyRate: number;
  total: number;

  reservationDate: string;

  contact: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  };
};

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return "Invalid time";
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
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

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState("GCash");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const state = location.state as PaymentState | null;

  if (!state) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <span className="text-2xl">🐾</span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900">
              Payment information not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Please select a pet and create a booking first.
            </p>

            <button
              type="button"
              onClick={() => navigate("/pets")}
              className="mt-6 rounded-xl bg-[#442808] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5a370f] focus:outline-none focus:ring-2 focus:ring-[#442808]/30"
            >
              Back to Pets
            </button>
          </div>
        </div>
      </main>
    );
  }

  const paymentState: PaymentState = state;
  const pet = paymentState.pet;

  console.log("Start time:", paymentState.startTime);
  console.log("End time:", paymentState.endTime);

  async function handlePayment() {
    setError("");

    try {
      setLoading(true);

      await createPayment({
        booking_id: paymentState.bookingId,
        amount: paymentState.total,
        payment_method: selectedMethod,
      });

      navigate("/bookings");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-[#442808] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-lg">←</span>
            Back to booking
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Complete your payment
          </h1>

          <p className="mt-2 text-sm text-stone-500 sm:text-base">
            Review your booking details before completing your payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5">
                <h2 className="text-lg font-bold text-stone-900">
                  Booking details
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Information about your PawBorrow booking
                </p>
              </div>

              <div className="flex flex-col gap-5 p-6 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-36 sm:w-36">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🐾
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900">
                        {pet.name}
                      </h3>

                      {pet.breed && (
                        <p className="mt-1 text-sm text-stone-500">
                          {pet.breed}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                        Category
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        {pet.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                        Rate
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        ₱{paymentState.hourlyRate.toLocaleString()}
                        <span className="font-normal text-stone-400">
                          /hour
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5">
                <h2 className="text-lg font-bold text-stone-900">Schedule</h2>
              </div>

              <div className="grid grid-cols-1 divide-y divide-stone-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    Date
                  </p>

                  <p className="mt-2 font-semibold text-stone-900">
                    {paymentState.reservationDate}
                  </p>
                </div>

                <div className="px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    Time
                  </p>

                  <p className="mt-2 font-semibold text-stone-900">
                    {formatTime(paymentState.startTime)}
                    {" – "}
                    {formatTime(paymentState.endTime)}
                  </p>
                </div>

                <div className="px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    Duration
                  </p>

                  <p className="mt-2 font-semibold text-stone-900">
                    {formatDuration(paymentState.durationMinutes)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5">
                <h2 className="text-lg font-bold text-stone-900">
                  Contact information
                </h2>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-stone-800">
                    {paymentState.contact.firstName}{" "}
                    {paymentState.contact.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-stone-800">
                    {paymentState.contact.email}
                  </p>
                </div>

                {paymentState.contact.message && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                      Message
                    </p>

                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      {paymentState.contact.message}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5">
                <h2 className="text-lg font-bold text-stone-900">
                  Payment method
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Select how you would like to pay.
                </p>
              </div>

              <div className="p-6">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    selectedMethod === "GCash"
                      ? "border-[#442808] bg-[#442808]/5 ring-1 ring-[#442808]"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="GCash"
                    checked={selectedMethod === "GCash"}
                    onChange={(event) => setSelectedMethod(event.target.value)}
                    className="h-4 w-4 accent-[#442808]"
                  />

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xs font-bold">
                    <Banknote size={20} className="text-green-500" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Mock Payment</p>

                    <p className="text-xs text-stone-500">
                      Pay securely using our mock payment gateway.
                    </p>
                  </div>

                  {selectedMethod === "GCash" && (
                    <span className="text-sm font-semibold text-[#442808]">
                      Selected
                    </span>
                  )}
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 px-6 py-5">
                <h2 className="text-lg font-bold text-stone-900">
                  Payment summary
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone-500">Hourly rate</span>

                  <span className="font-medium text-stone-900">
                    ₱{paymentState.hourlyRate.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone-500">Duration</span>

                  <span className="font-medium text-stone-900">
                    {formatDuration(paymentState.durationMinutes)}
                  </span>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-stone-500">Calculation</span>

                    <span className="text-right font-medium text-stone-700">
                      ₱{paymentState.hourlyRate.toLocaleString()}
                      {" × "}
                      {paymentState.durationMinutes / 60}
                    </span>
                  </div>
                </div>

                <div className="mt-2 rounded-xl p-5 text-black">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-blac font-bold">Total</span>

                    <span className="text-2xl font-bold">
                      ₱{paymentState.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs leading-5 text-amber-800">
                    By checking out, you agree with our Terms of Service and
                    confirm that you have read our Privacy Policy. You can
                    cancel recurring payments at any time.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm leading-5 text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full rounded-xl bg-[#dcb764] px-5 py-3.5 text-sm font-bold text-[#442808] transition hover:bg-[#cdaa4d] focus:outline-none focus:ring-2 focus:ring-[#dcb764]/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₱${paymentState.total.toLocaleString()}`}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back to booking
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
