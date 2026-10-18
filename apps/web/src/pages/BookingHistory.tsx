import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Printer,
  ReceiptText,
  RotateCcw,
} from "lucide-react";
import { useBookings, type Booking, type BookingHistoryEntry } from "@repo/api";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "@/styles/Favorites.css";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-50 text-red-700",
  requested: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  none: "bg-gray-100 text-gray-600",
};

function formatLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatBookingDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(value: string | null) {
  if (!value) return "Time not specified";
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number.isFinite(amount) ? amount : 0);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createReceiptHtml(booking: Booking) {
  const payment = booking.payment;
  const receiptNumber = `PBR-${String(booking.booking_id).padStart(6, "0")}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${receiptNumber}</title>
  <style>
    body { margin: 0; padding: 36px; color: #1f2937; font-family: Arial, sans-serif; }
    .receipt { max-width: 760px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; gap: 20px; border-bottom: 3px solid #f5787b; padding-bottom: 20px; }
    h1 { margin: 0; color: #f5787b; } h2 { margin: 4px 0 0; font-size: 16px; }
    .meta { text-align: right; font-size: 13px; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; }
    .item { padding: 14px; border-radius: 10px; background: #f8fafc; }
    .label { color: #64748b; font-size: 11px; text-transform: uppercase; }
    .value { margin-top: 5px; font-weight: 700; }
    .total { margin-top: 24px; padding: 18px; background: #fef2f2; text-align: right; font-size: 21px; font-weight: 700; }
    .footer { margin-top: 34px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
    @media print { body { padding: 0; } .receipt { max-width: none; } }
  </style>
</head>
<body>
  <main class="receipt">
    <header class="header">
      <div><h1>PawBorrow</h1><h2>Booking Receipt</h2></div>
      <div class="meta"><strong>${receiptNumber}</strong><br/>Issued ${escapeHtml(formatDate(new Date().toISOString()))}</div>
    </header>
    <section class="grid">
      <div class="item"><div class="label">Pet</div><div class="value">${escapeHtml(booking.pet?.name ?? "Unknown pet")}</div></div>
      <div class="item"><div class="label">Breed</div><div class="value">${escapeHtml(booking.pet?.breed ?? "Not specified")}</div></div>
      <div class="item"><div class="label">Reservation date</div><div class="value">${escapeHtml(formatBookingDate(booking.reservation_date))}</div></div>
      <div class="item"><div class="label">Reservation time</div><div class="value">${escapeHtml(formatTime(booking.time_slot))}</div></div>
      <div class="item"><div class="label">Duration</div><div class="value">${escapeHtml(`${booking.duration_minutes ?? 0} minutes`)}</div></div>
      <div class="item"><div class="label">Booking status</div><div class="value">${escapeHtml(formatLabel(booking.status))}</div></div>
      <div class="item"><div class="label">Payment status</div><div class="value">${escapeHtml(formatLabel(payment?.payment_status ?? "unknown"))}</div></div>
      <div class="item"><div class="label">Transaction reference</div><div class="value">${escapeHtml(payment?.transaction_reference ?? "—")}</div></div>
    </section>
    <div class="total">Total paid: ${escapeHtml(formatCurrency(payment?.amount))}</div>
    <footer class="footer">This receipt confirms your PawBorrow pet companionship booking. Keep it for your records.</footer>
  </main>
</body>
</html>`;
}

function printReceipt(booking: Booking) {
  const printWindow = window.open("", "_blank", "width=900,height=760");

  if (!printWindow) {
    window.alert("Allow pop-ups to print your receipt.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(createReceiptHtml(booking));
  printWindow.document.close();
  printWindow.focus();
  printWindow.setTimeout(() => printWindow.print(), 250);
}

function downloadReceipt(booking: Booking) {
  const blob = new Blob([createReceiptHtml(booking)], {
    type: "text/html",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `pawborrow-receipt-${booking.booking_id}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Timeline({ entries }: { entries: BookingHistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
        No timeline entries are available yet.
      </p>
    );
  }

  return (
    <div>
      {entries.map((entry, index) => (
        <div key={entry.history_id} className="relative flex gap-3 pb-5">
          {index < entries.length - 1 && (
            <span className="absolute left-[5px] top-3 h-full w-px bg-gray-200" />
          )}

          <span className="relative mt-1.5 size-3 shrink-0 rounded-full bg-froly-400 ring-4 ring-froly-50" />

          <div>
            <p className="m-0 font-semibold text-gray-800">
              {formatLabel(entry.event_type)}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {entry.note ||
                (entry.old_status && entry.new_status
                  ? `${formatLabel(entry.old_status)} → ${formatLabel(entry.new_status)}`
                  : "Booking updated")}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {formatDate(entry.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookingHistory() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, error, refetch } = useBookings();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      <main className="favorites-page">
        <div className="favorites-tabs">
          <Link to="/bookings" className="favorites-tab is-active">
            Booking History
          </Link>

          <Link to="/favorites" className="favorites-tab">
            Pets You Liked
          </Link>
        </div>

        <section className="favorites-section">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="favorites-heading">Booking History</h1>
              <p className="mt-2 text-sm text-gray-500">
                Review your reservations, payments, refunds, and receipts.
              </p>
            </div>

            {!isLoading && !error && (
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                <RotateCcw size={15} /> Refresh
              </button>
            )}
          </div>

          {isLoading && (
            <p className="favorites-empty">Loading your bookings...</p>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">
                Failed to load your bookings:{" "}
                {error instanceof Error ? error.message : String(error)}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <CalendarDays size={38} className="mx-auto text-gray-300" />
              <p className="mt-3 font-semibold text-gray-700">
                You have no past or upcoming bookings.
              </p>
            </div>
          )}

          {!isLoading && !error && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const pet = booking.pet;
                const normalizedStatus = booking.status.toLowerCase();
                const canReview = normalizedStatus === "completed";
                const expanded = expandedId === booking.booking_id;
                const refundStatus = booking.payment?.refund_status ?? "none";

                return (
                  <article
                    key={booking.booking_id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="grid items-center gap-4 p-5 md:grid-cols-[auto_1fr_auto_auto]">
                      <img
                        src={pet?.image_url ?? "/images/pet-placeholder.jpg"}
                        alt={pet?.name ?? "Pet"}
                        className="size-16 rounded-xl bg-gray-100 object-cover"
                      />

                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-gray-900">
                          {pet?.name ?? "Unknown pet"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {pet?.breed ?? "Breed not specified"}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {formatBookingDate(booking.reservation_date)} ·{" "}
                          {formatTime(booking.time_slot)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[normalizedStatus] ?? statusStyles.pending}`}
                        >
                          {formatLabel(booking.status)}
                        </span>

                        {refundStatus !== "none" && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[refundStatus] ?? statusStyles.none}`}
                          >
                            Refund {formatLabel(refundStatus)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : booking.booking_id)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        aria-expanded={expanded}
                      >
                        Details
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                        <div className="grid gap-5 lg:grid-cols-2">
                          <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <h3 className="flex items-center gap-2 font-bold text-gray-800">
                              <ReceiptText
                                size={18}
                                className="text-froly-400"
                              />
                              Payment details
                            </h3>

                            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                              <div>
                                <dt className="text-xs text-gray-400">
                                  Amount
                                </dt>
                                <dd className="mt-1 font-bold text-gray-800">
                                  {formatCurrency(booking.payment?.amount)}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs text-gray-400">
                                  Payment status
                                </dt>
                                <dd className="mt-1 font-semibold text-gray-700">
                                  {formatLabel(
                                    booking.payment?.payment_status ??
                                      "unknown",
                                  )}
                                </dd>
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-xs text-gray-400">
                                  Transaction reference
                                </dt>
                                <dd className="mt-1 break-all font-mono text-sm font-semibold text-gray-700">
                                  {booking.payment?.transaction_reference ??
                                    "Not available"}
                                </dd>
                              </div>
                            </dl>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => printReceipt(booking)}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                              >
                                <Printer size={16} /> Print receipt
                              </button>
                              <button
                                type="button"
                                onClick={() => downloadReceipt(booking)}
                                className="inline-flex items-center gap-2 rounded-xl bg-froly-400 px-4 py-2 text-sm font-semibold text-white hover:bg-froly-500"
                              >
                                <Download size={16} /> Download receipt
                              </button>
                            </div>
                          </section>

                          <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <h3 className="font-bold text-gray-800">
                              Refund information
                            </h3>

                            {refundStatus === "none" ? (
                              <p className="mt-4 text-sm text-gray-500">
                                No refund has been requested for this booking.
                              </p>
                            ) : (
                              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                  <dt className="text-xs text-gray-400">
                                    Status
                                  </dt>
                                  <dd className="mt-1 font-semibold text-gray-700">
                                    {formatLabel(refundStatus)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-xs text-gray-400">
                                    Amount
                                  </dt>
                                  <dd className="mt-1 font-bold text-gray-800">
                                    {formatCurrency(
                                      booking.payment?.refund_amount,
                                    )}
                                  </dd>
                                </div>
                                <div className="sm:col-span-2">
                                  <dt className="text-xs text-gray-400">
                                    Reason
                                  </dt>
                                  <dd className="mt-1 text-gray-700">
                                    {booking.payment?.refund_reason ??
                                      "No reason provided"}
                                  </dd>
                                </div>
                                {booking.payment?.refunded_at && (
                                  <div className="sm:col-span-2">
                                    <dt className="text-xs text-gray-400">
                                      Completed
                                    </dt>
                                    <dd className="mt-1 text-gray-700">
                                      {formatDate(booking.payment.refunded_at)}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            )}
                          </section>
                        </div>

                        {booking.cancellation_reason && (
                          <section className="mt-5 rounded-xl border border-red-100 bg-red-50 p-5">
                            <h3 className="font-bold text-red-700">
                              Cancellation reason
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-red-700">
                              {booking.cancellation_reason}
                            </p>
                          </section>
                        )}

                        <section className="mt-5 rounded-xl border border-gray-100 bg-white p-5">
                          <h3 className="mb-5 font-bold text-gray-800">
                            Booking status timeline
                          </h3>
                          <Timeline entries={booking.booking_history} />
                        </section>

                        {canReview && (
                          <div className="mt-5 text-right">
                            <button
                              type="button"
                              className="booking-review-btn"
                              onClick={() =>
                                navigate(`/review/${booking.booking_id}`, {
                                  state: { booking },
                                })
                              }
                            >
                              Review this booking
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
