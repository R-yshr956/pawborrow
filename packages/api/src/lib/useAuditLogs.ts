import { useQuery } from "@tanstack/react-query";

import { getAuditLogs, type AuditLog } from "./audit";

export function useAuditLogs() {
  return useQuery<AuditLog[], Error>({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
    staleTime: 30_000,
  });
}
