import { supabase } from "../supabaseClient";

export type CreateBookingInput = {
  pet_id: number;
  reservation_date: string;
  time_slot: string;
  duration_minutes: number;
};
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type Booking = {
  booking_id: number;
  reservation_date: string;
  time_slot: string | null;
  duration_minutes: number | null;
  status: string;
  created_at: string;

  pet: {
    pet_id: number;
    name: string;
    breed: string | null;
    image_url: string | null;
  } | null;
};

export async function createBooking(input: CreateBookingInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to book a pet.");
  }

  if (
    input.duration_minutes < 60 ||
    input.duration_minutes % 15 !== 0
  ) {
    throw new Error("Invalid booking duration.");
  }

  const { data, error } = await supabase
    .from("booking")
    .insert({
      user_id: user.id,
      pet_id: input.pet_id,
      reservation_date: input.reservation_date,
      time_slot: input.time_slot,
      duration_minutes: input.duration_minutes,
    })
    .select()
    .single();

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

  if (userError) throw userError;

  if (!user) {
    throw new Error("You must be signed in to view your bookings.");
  }

  const { data, error } = await supabase
    .from("booking")
    .select(`
      booking_id,
      reservation_date,
      time_slot,
      duration_minutes,
      status,
      created_at,
      pet (
        pet_id,
        name,
        breed,
        image_url
      )
    `)
    .eq("user_id", user.id)
    .order("reservation_date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((booking) => ({
    ...booking,
    pet: Array.isArray(booking.pet)
      ? booking.pet[0] ?? null
      : booking.pet ?? null,
  }));
}


export type AdminBooking = {
  booking_id: number;
  reservation_date: string;
  time_slot: string | null;
  duration_minutes: number;
  status: string;
  created_at: string;

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
};

export async function getAdminBookings(): Promise<AdminBooking[]> {
  const { data, error } = await supabase
    .from("booking")
    .select(`
      booking_id,
      reservation_date,
      time_slot,
      duration_minutes,
      status,
      created_at,

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
      )
    `)
    .order("reservation_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((booking) => ({
    ...booking,

    pet: Array.isArray(booking.pet)
      ? booking.pet[0] ?? null
      : booking.pet ?? null,

    user_profile: Array.isArray(booking.user_profiles)
      ? booking.user_profiles[0] ?? null
      : booking.user_profiles ?? null,
  }));
}

export async function updateBookingStatus(
  bookingId: number,
  status: BookingStatus
) {
  const { data, error } = await supabase
    .from("booking")
    .update({
      status,
    })
    .eq("booking_id", bookingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export type RescheduleBookingInput = {
  bookingId: number;
  reservationDate: string;
  timeSlot: string;
  durationMinutes: number;
};

export async function rescheduleBooking(
  input: RescheduleBookingInput
) {
  if (
    input.durationMinutes < 60 ||
    input.durationMinutes % 15 !== 0
  ) {
    throw new Error(
      "Booking duration must be at least 1 hour and use 15-minute increments."
    );
  }

  const { data, error } = await supabase
    .from("booking")
    .update({
      reservation_date: input.reservationDate,
      time_slot: input.timeSlot,
      duration_minutes: input.durationMinutes,
    })
    .eq("booking_id", input.bookingId)
    .select()
    .single();

  if (error) throw error;

  return data;
}