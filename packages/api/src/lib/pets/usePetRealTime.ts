import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export function usePetRealTime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("pet-status-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pet",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["pets"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}