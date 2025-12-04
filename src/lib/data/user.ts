import type { User, UserRow } from "../../types/user";
import { supabase } from "../supabase";
import { transformUserRow, transformUserRows } from "../transformers";
import { ERROR_MESSAGES } from "../constants";

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

export async function fetchUsersByGroup(userId: string): Promise<User[]> {
  const { data, error } = await supabase.rpc("get_users_in_same_group", {
    user_id: userId,
  });

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_ERROR, error);
    return [];
  }

  return transformUserRows((data || []) as UserRow[]);
}

export async function fetchAllUsers(userId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("user")
    .select()
    .neq("id", userId);

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_ERROR, error);
    return [];
  }

  return transformUserRows((data || []) as UserRow[]);
}

export async function getUser(userId: string): Promise<UserRow> {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(ERROR_MESSAGES.USER.FETCH_FAILED, error);
    throw new Error(ERROR_MESSAGES.USER.FETCH_FAILED);
  }

  return data as UserRow;
}
