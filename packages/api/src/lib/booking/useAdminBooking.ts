import { useQuery } from "@tanstack/react-query";
import { getAdminBookings } from "./booking";

export function useAdminBookings() {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminBookings,
  });
}