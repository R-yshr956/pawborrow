import { supabase } from "./supabaseClient";

export type UserRole = "admin" | "customer";

export type UserProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;

  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type UpdateProfileInput = {
  first_name?: string;
  last_name?: string;
  phone?: string;
};

export async function getMyProfile(
  userId: string,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      is_active,
      created_at,
      avatar_url
    `)
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function updateMyProfile(
  userId: string,
  updates: UpdateProfileInput,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select(`
      id,
      email,
      first_name,
      last_name,
      phone,
      avatar_url,
      role,
      is_active,
      created_at
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      is_active,
      created_at,
      avatar_url
    `);

  if (error) {
    throw error;
  }

  return data;
}