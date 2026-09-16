import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "./profile";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_profiles", user?.id],

    queryFn: () => {
      if (!user) {
        throw new Error("User is not signed in");
      }

      return getMyProfile(user.id);
    },

    enabled: !!user,
  });
}