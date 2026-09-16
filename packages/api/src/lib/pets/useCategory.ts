import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./category";

export function useCategories() {
  return useQuery({
    queryKey: ["pet_categories"],
    queryFn: getCategories,
  });
}