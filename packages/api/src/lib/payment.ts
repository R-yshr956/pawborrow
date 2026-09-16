import { supabase } from "./supabaseClient";

export type CreatePaymentInput = {
  booking_id: number;
  amount: number;
  payment_method: string;
};

export async function createPayment(input: CreatePaymentInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to make a payment.");
  }

  const { data: booking, error: bookingError } = await supabase
    .from("booking")
    .select("booking_id, user_id")
    .eq("booking_id", input.booking_id)
    .single();

  if (bookingError) {
    throw bookingError;
  }

  if (booking.user_id !== user.id) {
    throw new Error("You cannot pay for this booking.");
  }

  const { data, error } = await supabase
    .from("payment")
    .insert({
      booking_id: input.booking_id,
      amount: input.amount,
      payment_method: input.payment_method,
      payment_status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}