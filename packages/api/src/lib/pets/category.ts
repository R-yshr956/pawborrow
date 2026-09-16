import { supabase } from "../supabaseClient";

export type PetCategory = {
  id: number;
  label: string;
  description: string | null;
  hourlyRate: number;
};

export async function getCategories(): Promise<PetCategory[]> {
  const { data, error } = await supabase
    .from("pet_category")
    .select(`
      category_id,
      category_name,
      description,
      hourly_rate
    `)
    .order("category_name");

  if (error) {
    throw error;
  }

  return (data ?? []).map((category) => ({
    id: category.category_id,
    label: category.category_name,
    description: category.description,
    hourlyRate: Number(category.hourly_rate ?? 0),
  }));
}