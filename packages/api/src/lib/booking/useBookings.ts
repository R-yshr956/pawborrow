import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../booking/booking";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
}