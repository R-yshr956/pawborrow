import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateMyProfile,
  type UpdateProfileInput,
} from "./profile";

import { useAuth } from "./useAuth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (updates: UpdateProfileInput) => {
      if (!user) {
        throw new Error("User is not signed in");
      }

      return updateMyProfile(user.id, updates);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_profiles", user?.id],
      });
    },
  });
}