import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rescheduleBooking,
  type RescheduleBookingInput,
} from "./booking";

export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RescheduleBookingInput) =>
      rescheduleBooking(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-bookings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });
}