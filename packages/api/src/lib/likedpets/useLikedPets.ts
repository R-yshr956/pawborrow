import { useQuery } from "@tanstack/react-query";
import { getLikedPets } from "./likedPet";

export function useLikedPets(enabled = true) {
  return useQuery({
    queryKey: ["liked-pets"],
    queryFn: getLikedPets,
    enabled,
  });
}