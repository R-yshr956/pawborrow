import { useQuery } from "@tanstack/react-query";
import { getAllReviews } from "./review";

export function useReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAllReviews,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
}