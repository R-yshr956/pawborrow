import { useQuery } from "@tanstack/react-query";
import { getAllProfiles } from "./profile";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["user_profiles", "admin"],
    queryFn: getAllProfiles,
  });
}