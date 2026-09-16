import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLikedPet } from "./likedPet";

export function useRemoveLikedPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: number) => removeLikedPet(petId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["liked-pets"],
      });
    },
  });
}