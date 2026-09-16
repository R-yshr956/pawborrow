// --- Admin: list every profile (blocked by RLS for non-admins) ---
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
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}