import { supabase } from "../supabaseClient";

export type CreateReviewInput = {
  booking_id: number;
  rating: number;
  comment?: string;
};

export type Review = {
  feedback_id: number;
  booking_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
};

export async function createReview(
  input: CreateReviewInput
): Promise<Review> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("You must be signed in to leave a review.");
  }

  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const { data, error } = await supabase
    .from("rating_feedback")
    .insert({
      booking_id: input.booking_id,
      rating: input.rating,
      comment: input.comment ?? null,
    })
    .select()
    .single();

  if (error) {
    // Unique violation means this booking already has a review
    if (error.code === "23505") {
      throw new Error("You've already reviewed this booking.");
    }
    throw error;
  }

  return data;
}

export type ReviewWithDetails = {
  feedback_id: number;
  booking_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  booking: {
    user: {
      first_name: string | null;
      last_name: string | null;
      email: string;
    } | null;
    pet: {
      name: string;
      image_url: string | null;
    } | null;
  } | null;
};

export async function getAllReviews(): Promise<ReviewWithDetails[]> {
  const { data, error } = await supabase
    .from("rating_feedback")
    .select(`
      feedback_id,
      booking_id,
      rating,
      comment,
      created_at,
      booking (
        user:user_profiles (
          first_name,
          last_name,
          email
        ),
        pet (
          name,
          image_url
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ReviewWithDetails[];
}