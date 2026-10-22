import { useMemo, useState } from "react";
import {
  CalendarClock,
  Download,
  Eye,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  getBookingDisplayStatus,
  useAdminBookings,
  useAdminRescheduleBooking,
  useCurrentTime,
  useUpdateBookingOperations,
  useUpdateRefund,
  type AdminBooking,
  type BookingStatus,
  type RefundStatus,
} from "@repo/api";

import Header from "../components/Header";
import Modal from "../components/Modal";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-50 text-blue-700",
};

const refundStyles: Record<string, string> = {
  none: "bg-gray-100 text-gray-600",
  requested: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
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
  if (!value) return "—";
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!remainder) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${hours}h ${remainder}m`;
}

function calculateEndTime(startTime: string | null, duration: number) {
  if (!startTime) return "—";
  const [hours, minutes] = startTime.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return "—";

  const date = new Date();
  date.setHours(hours, minutes + duration, 0, 0);
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

function getCustomerName(booking: AdminBooking) {
  const profile = booking.user_profile;
  return (
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.email ||
    "Unknown customer"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createReceiptHtml(booking: AdminBooking) {
  const payment = booking.payment;
  const receiptNumber = `PBR-${String(booking.booking_id).padStart(6, "0")}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${receiptNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 36px; }
    .receipt { max-width: 760px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #38bdf8; padding-bottom: 20px; }
    h1 { margin: 0; color: #0ea5e9; } h2 { margin: 4px 0 0; font-size: 16px; }
    .meta { text-align: right; font-size: 13px; line-height: 1.6; }
    .section { margin-top: 28px; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .item { background: #f8fafc; border-radius: 10px; padding: 14px; }
    .label { color: #64748b; font-size: 11px; text-transform: uppercase; }
    .value { margin-top: 5px; font-weight: 700; }
    .total { margin-top: 24px; padding: 18px; background: #ecfeff; text-align: right; font-size: 21px; font-weight: 700; }
    .footer { margin-top: 34px; border-top: 1px solid #e5e7eb; padding-top: 16px; color: #64748b; font-size: 12px; }
    @media print { body { padding: 0; } .receipt { max-width: none; } }
  </style>
</head>
<body>
  <main class="receipt">
    <header class="header">
      <div><h1>PawBorrow</h1><h2>Booking Receipt</h2></div>
      <div class="meta"><strong>${receiptNumber}</strong><br/>Issued ${escapeHtml(formatDate(new Date().toISOString()))}</div>
    </header>
    <section class="section grid">
      <div class="item"><div class="label">Customer</div><div class="value">${escapeHtml(getCustomerName(booking))}</div></div>
      <div class="item"><div class="label">Email</div><div class="value">${escapeHtml(booking.user_profile?.email ?? "—")}</div></div>
      <div class="item"><div class="label">Pet</div><div class="value">${escapeHtml(booking.pet?.name ?? "Unknown pet")}</div></div>
      <div class="item"><div class="label">Breed</div><div class="value">${escapeHtml(booking.pet?.breed ?? "Not specified")}</div></div>
      <div class="item"><div class="label">Schedule</div><div class="value">${escapeHtml(formatBookingDate(booking.reservation_date))}, ${escapeHtml(formatTime(booking.time_slot))}</div></div>
      <div class="item"><div class="label">Duration</div><div class="value">${escapeHtml(formatDuration(booking.duration_minutes))}</div></div>
      <div class="item"><div class="label">Payment method</div><div class="value">${escapeHtml(payment?.payment_method ?? "—")}</div></div>
      <div class="item"><div class="label">Transaction reference</div><div class="value">${escapeHtml(payment?.transaction_reference ?? "—")}</div></div>
      <div class="item"><div class="label">Payment status</div><div class="value">${escapeHtml(formatLabel(payment?.payment_status ?? "unknown"))}</div></div>
      <div class="item"><div class="label">Booking status</div><div class="value">${escapeHtml(formatLabel(booking.status))}</div></div>
    </section>
    <div class="total">Total paid: ${escapeHtml(formatCurrency(payment?.amount))}</div>
    <footer class="footer">This receipt confirms a PawBorrow pet companionship booking. It is not a shipping invoice or packing slip.</footer>
  </main>
</body>
</html>`;
}

function printReceipt(booking: AdminBooking) {
  const printWindow = window.open("", "_blank", "width=900,height=760");
  if (!printWindow) {
    window.alert("Allow pop-ups to print the receipt.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(createReceiptHtml(booking));
  printWindow.document.close();
  printWindow.focus();
  printWindow.setTimeout(() => printWindow.print(), 250);
}

function downloadReceipt(booking: AdminBooking) {
  const blob = new Blob([createReceiptHtml(booking)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pawborrow-receipt-${booking.booking_id}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Bookings() {
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useAdminBookings();
  const now = useCurrentTime();
  const updateBooking = useUpdateBookingOperations();
  const updateRefund = useUpdateRefund();
  const rescheduleBooking = useAdminRescheduleBooking();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellationReason, setCancellationReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [refundStatus, setRefundStatus] = useState<RefundStatus>("none");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [actionError, setActionError] = useState("");

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("09:00");
  const [rescheduleDuration, setRescheduleDuration] = useState(60);

  const selected =
    bookings.find((booking) => booking.booking_id === selectedId) ?? null;

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (
        statusFilter !== "all" &&
        booking.status.toLowerCase() !== statusFilter
      ) {
        return false;
      }

      if (!search) return true;

      return [
        booking.booking_id,
        booking.pet?.name ?? "",
        booking.pet?.breed ?? "",
        getCustomerName(booking),
        booking.user_profile?.email ?? "",
        booking.payment?.transaction_reference ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [bookings, searchTerm, statusFilter]);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((item) => item.status === "pending").length,
      confirmed: bookings.filter((item) => item.status === "confirmed").length,
      completed: bookings.filter((item) => item.status === "completed").length,
      refunds: bookings.filter(
        (item) => item.payment && item.payment.refund_status !== "none",
      ).length,
    }),
    [bookings],
  );

  function openDetails(booking: AdminBooking) {
    setSelectedId(booking.booking_id);
    setCancellationReason(booking.cancellation_reason ?? "");
    setAdminNotes(booking.admin_notes ?? "");
    setRefundStatus(booking.payment?.refund_status ?? "none");
    setRefundAmount(
      booking.payment?.refund_amount == null
        ? ""
        : String(booking.payment.refund_amount),
    );
    setRefundReason(booking.payment?.refund_reason ?? "");
    setActionError("");
  }

  function closeDetails() {
    if (updateBooking.isPending || updateRefund.isPending) return;
    setSelectedId(null);
    setActionError("");
  }

  function changeStatus(status: BookingStatus) {
    if (!selected) return;
    if (status === "cancelled" && !cancellationReason.trim()) {
      setActionError("Enter a cancellation reason before cancelling.");
      return;
    }

    setActionError("");
    updateBooking.mutate(
      {
        bookingId: selected.booking_id,
        status,
        cancellationReason:
          status === "cancelled" ? cancellationReason : undefined,
      },
      {
        onError: (cause) =>
          setActionError(
            cause instanceof Error
              ? cause.message
              : "Could not update booking.",
          ),
      },
    );
  }

  function saveNotes() {
    if (!selected) return;
    setActionError("");
    updateBooking.mutate(
      { bookingId: selected.booking_id, adminNotes },
      {
        onError: (cause) =>
          setActionError(
            cause instanceof Error ? cause.message : "Could not save notes.",
          ),
      },
    );
  }

  function saveRefund() {
    if (!selected?.payment) return;
    const amount = refundAmount.trim() ? Number(refundAmount) : null;

    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      setActionError("Enter a valid refund amount.");
      return;
    }

    if (amount !== null && amount > Number(selected.payment.amount)) {
      setActionError("Refund amount cannot exceed the amount paid.");
      return;
    }

    if (refundStatus !== "none" && !refundReason.trim()) {
      setActionError("Enter a reason for this refund update.");
      return;
    }

    setActionError("");
    updateRefund.mutate(
      {
        paymentId: selected.payment.payment_id,
        refundStatus,
        refundAmount: amount,
        refundReason,
      },
      {
        onError: (cause) =>
          setActionError(
            cause instanceof Error ? cause.message : "Could not update refund.",
          ),
      },
    );
  }

  function openReschedule() {
    if (!selected) return;
    setRescheduleDate(selected.reservation_date);
    setRescheduleTime(selected.time_slot ?? "09:00");
    setRescheduleDuration(selected.duration_minutes);
    setRescheduleOpen(true);
  }

  function saveReschedule() {
    if (!selected || !rescheduleDate || !rescheduleTime) return;
    rescheduleBooking.mutate(
      {
        bookingId: selected.booking_id,
        reservationDate: rescheduleDate,
        timeSlot: rescheduleTime,
        durationMinutes: rescheduleDuration,
      },
      {
        onSuccess: () => setRescheduleOpen(false),
        onError: (cause) =>
          setActionError(
            cause instanceof Error ? cause.message : "Could not reschedule.",
          ),
      },
    );
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-50">
      <Header title="BOOKING MANAGEMENT" />

      <main className="p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage appointments, payments, receipts, cancellations, and
              refunds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total", counts.total],
            ["Pending", counts.pending],
            ["Confirmed", counts.confirmed],
            ["Completed", counts.completed],
            ["Refund cases", counts.refunds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, pet, booking, or transaction..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          >
            <option value="all">All booking statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </section>

        {isLoading && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
            Loading bookings...
          </p>
        )}

        {error && (
          <p className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Could not load bookings."}
          </p>
        )}

        {!isLoading && !error && filteredBookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <CalendarClock size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">
              No bookings found
            </p>
          </div>
        )}

        {!isLoading && !error && filteredBookings.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Booking</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Schedule</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Refund</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => {
                    const displayStatus = getBookingDisplayStatus(booking, now);
                    return (
                      <tr
                        key={booking.booking_id}
                        className="hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">
                            #{booking.booking_id} ·{" "}
                            {booking.pet?.name ?? "Unknown pet"}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {booking.pet?.breed ?? "Breed not specified"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">
                            {getCustomerName(booking)}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {booking.user_profile?.email ?? "—"}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          <p>{formatBookingDate(booking.reservation_date)}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formatTime(booking.time_slot)} ·{" "}
                            {formatDuration(booking.duration_minutes)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-700">
                            {formatCurrency(booking.payment?.amount)}
                          </p>
                          <p className="mt-1 font-mono text-xs text-gray-400">
                            {booking.payment?.transaction_reference ??
                              "No reference"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[displayStatus] ?? statusStyles.pending}`}
                          >
                            {formatLabel(displayStatus)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${refundStyles[booking.payment?.refund_status ?? "none"]}`}
                          >
                            {formatLabel(
                              booking.payment?.refund_status ?? "none",
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openDetails(booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={Boolean(selected)}
        onClose={closeDetails}
        title={selected ? `Booking #${selected.booking_id}` : undefined}
      >
        {selected && (
          <div className="max-h-[78vh] space-y-6 overflow-y-auto pr-1 text-sm">
            <section className="rounded-2xl bg-sky-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {selected.pet?.name ?? "Unknown pet"}
                  </p>
                  <p className="text-gray-500">
                    Booked by {getCustomerName(selected)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[getBookingDisplayStatus(selected, now)] ?? statusStyles.pending}`}
                >
                  {formatLabel(getBookingDisplayStatus(selected, now))}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="font-semibold text-gray-700">
                    {formatBookingDate(selected.reservation_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="font-semibold text-gray-700">
                    {formatTime(selected.time_slot)}–
                    {calculateEndTime(
                      selected.time_slot,
                      selected.duration_minutes,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-700">
                    {formatDuration(selected.duration_minutes)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-bold text-gray-800">Payment and receipt</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => printReceipt(selected)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <Printer size={14} /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadReceipt(selected)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-600"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
              <div className="grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Amount paid</p>
                  <p className="font-bold text-gray-800">
                    {formatCurrency(selected.payment?.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment status</p>
                  <p className="font-semibold text-gray-700">
                    {formatLabel(selected.payment?.payment_status ?? "unknown")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment method</p>
                  <p className="font-semibold text-gray-700">
                    {selected.payment?.payment_method ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Transaction date</p>
                  <p className="font-semibold text-gray-700">
                    {formatDate(selected.payment?.transaction_date)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">Transaction reference</p>
                  <p className="break-all font-mono font-semibold text-gray-700">
                    {selected.payment?.transaction_reference ?? "—"}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-bold text-gray-800">Booking actions</h3>
              <div className="space-y-3 rounded-xl border border-gray-100 p-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">
                    Cancellation reason
                  </span>
                  <textarea
                    value={cancellationReason}
                    onChange={(event) =>
                      setCancellationReason(event.target.value)
                    }
                    rows={2}
                    placeholder="Required when cancelling a booking"
                    className="w-full resize-y rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-sky-400"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {selected.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => changeStatus("confirmed")}
                      disabled={updateBooking.isPending}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {selected.status !== "completed" &&
                    selected.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => changeStatus("completed")}
                        disabled={updateBooking.isPending}
                        className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Mark completed
                      </button>
                    )}
                  {selected.status !== "completed" &&
                    selected.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={openReschedule}
                        disabled={rescheduleBooking.isPending}
                        className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Reschedule
                      </button>
                    )}
                  {selected.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => changeStatus("cancelled")}
                      disabled={updateBooking.isPending}
                      className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-bold text-gray-800">
                Refund management
              </h3>
              {selected.payment ? (
                <div className="grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-1 block text-xs font-semibold text-gray-500">
                      Refund status
                    </span>
                    <select
                      value={refundStatus}
                      onChange={(event) =>
                        setRefundStatus(event.target.value as RefundStatus)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="requested">Requested</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                  <label>
                    <span className="mb-1 block text-xs font-semibold text-gray-500">
                      Refund amount
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={Number(selected.payment.amount)}
                      value={refundAmount}
                      onChange={(event) => setRefundAmount(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-xs font-semibold text-gray-500">
                      Refund reason
                    </span>
                    <textarea
                      value={refundReason}
                      onChange={(event) => setRefundReason(event.target.value)}
                      rows={2}
                      className="w-full resize-y rounded-lg border border-gray-200 p-3 text-sm"
                    />
                  </label>
                  <div className="sm:col-span-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                      Refunded: {formatDate(selected.payment.refunded_at)}
                    </p>
                    <button
                      type="button"
                      onClick={saveRefund}
                      disabled={updateRefund.isPending}
                      className="rounded-lg bg-froly-400 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {updateRefund.isPending ? "Saving..." : "Save refund"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 p-4 text-gray-500">
                  No payment is attached to this booking.
                </p>
              )}
            </section>

            <section>
              <h3 className="mb-3 font-bold text-gray-800">Admin notes</h3>
              <textarea
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                rows={3}
                placeholder="Internal notes are visible only to administrators"
                className="w-full resize-y rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-400"
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={saveNotes}
                  disabled={updateBooking.isPending}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 disabled:opacity-50"
                >
                  Save notes
                </button>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-bold text-gray-800">Booking history</h3>
              <div className="space-y-0">
                {selected.booking_history.map((entry, index) => (
                  <div
                    key={entry.history_id}
                    className="relative flex gap-3 pb-5"
                  >
                    {index < selected.booking_history.length - 1 && (
                      <span className="absolute left-[5px] top-3 h-full w-px bg-gray-200" />
                    )}
                    <span className="relative mt-1.5 size-3 shrink-0 rounded-full bg-sky-400 ring-4 ring-sky-50" />
                    <div>
                      <p className="font-semibold text-gray-700">
                        {formatLabel(entry.event_type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.note ||
                          (entry.old_status && entry.new_status
                            ? `${formatLabel(entry.old_status)} → ${formatLabel(entry.new_status)}`
                            : "Booking updated")}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {selected.booking_history.length === 0 && (
                  <p className="rounded-xl bg-gray-50 p-4 text-gray-500">
                    No history entries yet.
                  </p>
                )}
              </div>
            </section>

            {actionError && (
              <p
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                role="alert"
              >
                {actionError}
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule booking"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">
              Reservation date
            </span>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(event) => setRescheduleDate(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">
              Start time
            </span>
            <input
              type="time"
              value={rescheduleTime}
              onChange={(event) => setRescheduleTime(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">
              Duration in minutes
            </span>
            <input
              type="number"
              min="60"
              step="15"
              value={rescheduleDuration}
              onChange={(event) =>
                setRescheduleDuration(Number(event.target.value))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">New schedule</p>
            <p className="mt-1 font-semibold text-gray-700">
              {rescheduleDate || "—"} · {formatTime(rescheduleTime)}–
              {calculateEndTime(rescheduleTime, rescheduleDuration)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRescheduleOpen(false)}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600"
            >
              Close
            </button>
            <button
              type="button"
              onClick={saveReschedule}
              disabled={
                rescheduleBooking.isPending ||
                !rescheduleDate ||
                !rescheduleTime ||
                rescheduleDuration < 60
              }
              className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {rescheduleBooking.isPending ? "Saving..." : "Save schedule"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
