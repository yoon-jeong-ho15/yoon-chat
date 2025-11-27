import { supabase } from "../supabase";
import { transformUserRow } from "../transformers";

/**
 * Fetch all users with their auth audit log data
 * Queries the auth.audit_log_entries table for authentication events
 */
export async function fetchUsersWithAuthLogs() {
  try {
    // Get all users
    const { data: userRows, error: usersError } = await supabase
      .from("user")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) throw usersError;

    // Transform user rows to User type
    const users = userRows ? userRows.map(transformUserRow) : [];

    // Try to get auth audit logs from auth schema
    // Note: This might fail if RLS policies don't allow access
    // In that case, we'll return empty array and handle gracefully
    const { data: auditLogs, error: logsError } = await supabase
      .schema("auth")
      .from("audit_log_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000); // Limit to recent 1000 entries for performance

    if (logsError) {
      console.warn(
        "Could not fetch audit logs (this is expected if using anon key):",
        logsError.message
      );
      // Return users with empty audit logs - this is expected behavior
      return { users, auditLogs: [] };
    }

    return { users, auditLogs: auditLogs || [] };
  } catch (error) {
    console.error("Error fetching users with auth logs:", error);
    return { users: [], auditLogs: [] };
  }
}

/**
 * Fetch auth audit logs for a specific user
 */
export async function fetchUserAuthLogs(userId: string) {
  try {
    const { data, error } = await supabase
      .schema("auth")
      .from("audit_log_entries")
      .select("*")
      .eq("instance_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user auth logs:", error);
    return [];
  }
}
