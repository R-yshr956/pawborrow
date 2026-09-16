import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLikedPet } from "./likedPet";

export function useAddLikedPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: number) => addLikedPet(petId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["liked-pets"],
      });
    },
  });
}