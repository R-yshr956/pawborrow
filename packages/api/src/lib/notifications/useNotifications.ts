import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "./notification";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
}