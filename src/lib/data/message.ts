import type { MessageViewRow } from "../../types/message";
import { supabase } from "../supabase";
import { transformMessageViewRows } from "../transformers";
import { ERROR_MESSAGES } from "../constants";

export async function fetchAllMessagesByUserId(userId: string) {
  const { data, error } = await supabase
    .from("v_message")
    .select(
      `
      id,
      author_id,
      author_username,
      author_profile_img,
      recipient_id,
      recipient_username,
      recipient_profile_img,
      message,
      created_at
    `
    )
    .or(`author_id.eq.${userId},recipient_id.eq.${userId}`);

  if (error) {
    console.error(ERROR_MESSAGES.MESSAGE.FETCH_ERROR, error);
    return [];
  }

  // Return data from v_message view, transforming to nested structure
  return transformMessageViewRows((data || []) as MessageViewRow[]);
}
/**
 * Insert a new message
 * @param authorId - The user sending the message
 * @param message - The message content
 * @param recipientId - Optional recipient ID. If not provided:
 *                      - Regular users always send to admin
 *                      - Admin must specify recipient
 */
export async function insertMessage(
  authorId: string,
  message: string,
  recipientId?: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("message")
    .insert({
      author_id: authorId,
      recipient_id: recipientId,
      message: message,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting message:", error);
    return null;
  }

  return data?.id || null;
}
