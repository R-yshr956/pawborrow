import { supabase } from "../supabaseClient";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type RefundStatus =
  | "none"
  | "requested"
  | "processing"
  | "completed"
  | "rejected"
  | "cancelled";

export type CreateBookingInput = {
  pet_id: number;
  reservation_date: string;
  time_slot: string;
  duration_minutes: number;
};

export type CompleteMockCheckoutInput = CreateBookingInput & {
  payment_method: string;
};

export type PaymentDetails = {
  payment_id: number;
  amount: number | string;
  payment_method: string | null;
  payment_status: string;
  transaction_reference: string | null;
  transaction_date: string;
  refund_status: RefundStatus;
  refund_amount: number | string | null;
  refund_reason: string | null;
  refunded_at: string | null;
};

export type BookingHistoryEntry = {
  history_id: number;
  event_type: string;
  old_status: string | null;
  new_status: string | null;
  note: string | null;
  metadata: Record<string, unknown> | null;
  changed_by: string | null;
  created_at: string;
};

export type Booking = {
  booking_id: number;
  reservation_date: string;
  time_slot: string | null;
  duration_minutes: number | null;
  status: string;
  cancellation_reason: string | null;
  created_at: string;

  pet: {
    pet_id: number;
    name: string;
    breed: string | null;
    image_url: string | null;
  } | null;

  payment: {
    amount: number | string;
    payment_status: string;
    transaction_reference: string | null;
    refund_status: RefundStatus;
    refund_amount: number | string | null;
    refund_reason: string | null;
    refunded_at: string | null;
  } | null;

  booking_history: BookingHistoryEntry[];
};

export type AdminBooking = {
  booking_id: number;
  reservation_date: string;
  time_slot: string | null;
  duration_minutes: number;
  status: string;
  cancellation_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;

  pet: {
    pet_id: number;
    name: string;
    breed: string | null;
    image_url: string | null;
  } | null;

  user_profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;

  payment: PaymentDetails | null;

  booking_history: BookingHistoryEntry[];
};

export type UpdateBookingOperationsInput = {
  bookingId: number;
  status?: BookingStatus;
  cancellationReason?: string | null;
  adminNotes?: string | null;
};

export type UpdateRefundInput = {
  paymentId: number;
  refundStatus: RefundStatus;
  refundAmount?: number | null;
  refundReason?: string | null;
};

export type CancelBookingInput = {
  bookingId: number;
  reason: string;
};

export type RescheduleBookingInput = {
  bookingId: number;
  reservationDate: string;
  timeSlot: string;
  durationMinutes: number;
};

function normalizeRelation<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function normalizeRelationList<T>(value: T | T[] | null): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

export async function completeMockCheckout(input: CompleteMockCheckoutInput) {
  const { data, error } = await supabase.rpc("complete_mock_checkout", {
    p_pet_id: input.pet_id,
    p_reservation_date: input.reservation_date,
    p_time_slot: input.time_slot,
    p_duration_minutes: input.duration_minutes,
    p_payment_method: input.payment_method,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getBookings(): Promise<Booking[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to view your bookings.");
  }

  const { data, error } = await supabase
    .from("booking")
    .select(
      `
        booking_id,
        reservation_date,
        time_slot,
        duration_minutes,
        status,
        cancellation_reason,
        created_at,
        payment!inner (
          amount,
          payment_status,
          transaction_reference,
          refund_status,
          refund_amount,
          refund_reason,
          refunded_at
        ),
        pet (
          pet_id,
          name,
          breed,
          image_url
        ),
        booking_history (
          history_id,
          event_type,
          old_status,
          new_status,
          note,
          metadata,
          changed_by,
          created_at
        )
      `,
    )
    .eq("user_id", user.id)
    .eq("payment.payment_status", "paid")
    .order("reservation_date", {
      ascending: false,
    })
    .order("created_at", {
      referencedTable: "booking_history",
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((booking) => ({
    ...booking,

    pet: normalizeRelation(booking.pet),

    payment: normalizeRelation(booking.payment),

    booking_history: normalizeRelationList(booking.booking_history),
  })) as Booking[];
}

export async function getAdminBookings(): Promise<AdminBooking[]> {
  const { data, error } = await supabase
    .from("booking")
    .select(
      `
        booking_id,
        reservation_date,
        time_slot,
        duration_minutes,
        status,
        cancellation_reason,
        admin_notes,
        created_at,
        updated_at,
        payment (
          payment_id,
          amount,
          payment_method,
          payment_status,
          transaction_reference,
          transaction_date,
          refund_status,
          refund_amount,
          refund_reason,
          refunded_at
        ),
        pet (
          pet_id,
          name,
          breed,
          image_url
        ),
        user_profiles (
          id,
          first_name,
          last_name,
          email
        ),
        booking_history (
          history_id,
          event_type,
          old_status,
          new_status,
          note,
          metadata,
          changed_by,
          created_at
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    })
    .order("created_at", {
      referencedTable: "booking_history",
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((booking) => ({
    booking_id: booking.booking_id,

    reservation_date: booking.reservation_date,

    time_slot: booking.time_slot,

    duration_minutes: Number(booking.duration_minutes ?? 0),

    status: booking.status,

    cancellation_reason: booking.cancellation_reason,

    admin_notes: booking.admin_notes,

    created_at: booking.created_at,

    updated_at: booking.updated_at,

    pet: normalizeRelation(booking.pet),

    user_profile: normalizeRelation(booking.user_profiles),

    payment: normalizeRelation(booking.payment),

    booking_history: normalizeRelationList(booking.booking_history),
  })) as AdminBooking[];
}

export async function cancelBooking(input: CancelBookingInput) {
  const reason = input.reason.trim();

  if (!reason) {
    throw new Error("A cancellation reason is required.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to cancel a booking.");
  }

  const { data, error } = await supabase.rpc("cancel_booking", {
    p_booking_id: input.bookingId,
    p_reason: reason,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateBookingOperations(
  input: UpdateBookingOperationsInput,
) {
  const updates: {
    status?: BookingStatus;
    cancellation_reason?: string | null;
    admin_notes?: string | null;
  } = {};

  if (input.status !== undefined) {
    updates.status = input.status;
  }

  if (input.cancellationReason !== undefined) {
    updates.cancellation_reason = input.cancellationReason?.trim() || null;
  }

  if (input.adminNotes !== undefined) {
    updates.admin_notes = input.adminNotes?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No booking changes were provided.");
  }

  const { data, error } = await supabase
    .from("booking")
    .update(updates)
    .eq("booking_id", input.bookingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRefund(input: UpdateRefundInput) {
  const refundAmount = input.refundAmount ?? null;

  if (refundAmount !== null && refundAmount < 0) {
    throw new Error("Refund amount cannot be negative.");
  }

  const refundedAt =
    input.refundStatus === "completed" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("payment")
    .update({
      refund_status: input.refundStatus,
      refund_amount: refundAmount,
      refund_reason: input.refundReason?.trim() || null,
      refunded_at: refundedAt,
    })
    .eq("payment_id", input.paymentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBookingStatus(
  bookingId: number,
  status: BookingStatus,
  cancellationReason?: string | null,
) {
  const updates: {
    status: BookingStatus;
    cancellation_reason?: string | null;
  } = {
    status,
  };

  if (cancellationReason !== undefined) {
    updates.cancellation_reason = cancellationReason?.trim() || null;
  }

  const { data, error } = await supabase
    .from("booking")
    .update(updates)
    .eq("booking_id", bookingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function rescheduleBooking(input: RescheduleBookingInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data, error } = await supabase.rpc("reschedule_booking", {
    p_booking_id: input.bookingId,
    p_reservation_date: input.reservationDate,
    p_time_slot: input.timeSlot,
    p_duration_minutes: input.durationMinutes,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function adminRescheduleBooking(input: RescheduleBookingInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data, error } = await supabase.rpc("admin_reschedule_booking", {
    p_booking_id: input.bookingId,
    p_reservation_date: input.reservationDate,
    p_time_slot: input.timeSlot,
    p_duration_minutes: input.durationMinutes,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getTotalBookings(): Promise<number> {
  const { count, error } = await supabase
    .from("booking")
    .select(
      `
        booking_id,
        payment!inner (
          payment_status
        )
      `,
      {
        count: "exact",
        head: true,
      },
    )
    .eq("payment.payment_status", "paid");

  if (error) {
    throw error;
  }

  return count ?? 0;
}
