import { useQuery } from "@tanstack/react-query";
import { getAllPetsAdmin } from "./pet";

export function useAdminPets() {
  return useQuery({
    queryKey: ["pets", "admin"],
    queryFn: getAllPetsAdmin,
  });
}