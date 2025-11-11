import type { User, UserRow } from "../types";
import { supabase } from "../supabase";
import { transformUserRow, transformUserRows } from "../transformers";
import { FRIEND_GROUP, ERROR_MESSAGES } from "../constants";

export async function fetchUserByUsername(username: string): Promise<User> {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_ERROR, error);
    throw new Error(ERROR_MESSAGES.USER.FETCH_FAILED);
  }

  return transformUserRow(data as UserRow);
}

export async function fetchUsersByGroup(
  group: string,
  username: string
): Promise<User[]> {
  // If group is "0" (all/public group), fetch all users except current user
  const isAllUsersGroup = group === FRIEND_GROUP.ALL;

  let query = supabase.from("user").select().neq("username", username);

  // If not fetching all users, filter by specific group or public group
  if (!isAllUsersGroup) {
    query = query.or(`friend_group.eq.${group},friend_group.eq.${FRIEND_GROUP.ALL}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_ERROR, error);
    return [];
  }

  return transformUserRows((data || []) as UserRow[]);
}

export async function getUser(username: string): Promise<UserRow> {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_FAILED, error);
    throw new Error(ERROR_MESSAGES.USER.FETCH_FAILED);
  }

  return data as UserRow;
}
