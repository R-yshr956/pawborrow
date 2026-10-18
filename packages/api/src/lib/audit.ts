import { supabase } from "./supabaseClient";

export type AuditLog = {
  audit_id: number;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  details: Record<string, unknown>;
  created_at: string;
};

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      `
      audit_id,
      admin_id,
      admin_email,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data,
      details,
      created_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;
  return (data ?? []) as AuditLog[];
}

export async function recordAdminAuditEvent(
  action: string,
  entityType: string,
  details: Record<string, unknown> = {},
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return;

  const { error } = await supabase.from("audit_logs").insert({
    admin_id: user.id,
    admin_email: user.email ?? null,
    action,
    entity_type: entityType,
    details,
  });

  if (error) throw error;
}
