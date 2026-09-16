import { supabase } from "../supabaseClient";

export type PetStatus = "available" | "unavailable" | "booked";

export type Pet = {
  id: number;
  name: string;
  breed: string | null;
  category: string;
  personality: string[];
  status: PetStatus;
  image: string | null;
  hourlyRate: number;
};
const PET_SELECT = `
  pet_id,
  name,
  breed,
  personality,
  status,
  image_url,
  pet_category (
    category_id,
    category_name,
    hourly_rate
  )
`;

function mapPetRow(pet: any): Pet {
  const category = Array.isArray(pet.pet_category)
    ? pet.pet_category[0]
    : pet.pet_category;

  return {
    id: pet.pet_id,
    name: pet.name,
    breed: pet.breed,
    category: category?.category_name ?? "Unknown",
    personality: pet.personality ?? [],
    status: pet.status,
    image: pet.image_url,
    hourlyRate: Number(category?.hourly_rate ?? 0),
  };
}


export async function getPets(): Promise<Pet[]> {
  const { data, error } = await supabase
    .from("pet")
    .select(PET_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapPetRow);
}

export async function getAllPetsAdmin(): Promise<Pet[]> {
  const { data, error } = await supabase
    .from("pet")
    .select(PET_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapPetRow);
}

export async function updatePetStatus(
  petId: number,
  status: PetStatus
): Promise<Pet> {
  const { data, error } = await supabase
    .from("pet")
    .update({ status })
    .eq("pet_id", petId)
    .select(PET_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPetRow(data);
}