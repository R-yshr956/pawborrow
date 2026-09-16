import { useQuery } from "@tanstack/react-query";
import { getPets } from "./pet";

export function usePets() {
  return useQuery({
    queryKey: ["pets"],
    queryFn: getPets,
  });
}