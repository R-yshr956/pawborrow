import { supabase } from "../supabaseClient";

export interface LikedPet {
  liked_pet_id: number;
  pet_id: number;
  created_at: string;

  pet: {
    pet_id: number;
    name: string;
    breed: string | null;
    image_url: string | null;
    status: string;

    category: {
      category_name: string;
      hourly_rate: number | string | null;
    } | null;
  } | null;
}

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  return user.id;
}

export async function getLikedPets(): Promise<LikedPet[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("liked_pet")
    .select(`
      liked_pet_id,
      pet_id,
      created_at,
      pet (
        pet_id,
        name,
        breed,
        image_url,
        status,
        category:pet_category (
          category_name,
          hourly_rate
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as LikedPet[];
}

export async function addLikedPet(petId: number): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("liked_pet").insert({
    user_id: userId,
    pet_id: petId,
  });

  if (error) {
    if (error.code === "23505") {
      return;
    }

    throw error;
  }
}

export async function removeLikedPet(petId: number): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("liked_pet")
    .delete()
    .eq("user_id", userId)
    .eq("pet_id", petId);

  if (error) throw error;
}

export async function checkPetIsLiked(petId: number): Promise<boolean> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("liked_pet")
    .select("liked_pet_id")
    .eq("user_id", userId)
    .eq("pet_id", petId)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}