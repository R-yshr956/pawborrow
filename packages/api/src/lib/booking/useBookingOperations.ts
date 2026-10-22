import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateBookingOperations,
  updateRefund,
  type UpdateBookingOperationsInput,
  type UpdateRefundInput,
} from "./booking";

async function invalidateBookingQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["admin-bookings"],
    }),

    queryClient.invalidateQueries({
      queryKey: ["bookings"],
    }),

    queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    }),

    queryClient.invalidateQueries({
      queryKey: ["audit-logs"],
    }),
  ]);
}

export function useUpdateBookingOperations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateBookingOperationsInput) =>
      updateBookingOperations(input),

    onSuccess: async () => {
      await invalidateBookingQueries(queryClient);
    },
  });
}

export function useUpdateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRefundInput) => updateRefund(input),

    onSuccess: async () => {
      await invalidateBookingQueries(queryClient);
    },
  });
}
