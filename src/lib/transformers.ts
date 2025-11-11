/**
 * Data transformation utilities
 * Following Toss frontend fundamentals - extract repeated logic
 */

import type { Message, MessageViewRow, User, UserRow } from "./types";

/**
 * Transform database message view row to Message type
 * Centralizes the transformation logic to avoid duplication
 */
export function transformMessageViewRow(row: MessageViewRow): Message {
  return {
    id: row.id,
    author: {
      id: row.author_id,
      username: row.author_username,
      profile_pic: row.author_profile_pic,
    },
    recipient: {
      id: row.recipient_id,
      username: row.recipient_username,
      profile_pic: row.recipient_profile_pic,
    },
    message: row.message,
    created_at: row.created_at,
  };
}

/**
 * Transform multiple message view rows to Message array
 */
export function transformMessageViewRows(rows: MessageViewRow[]): Message[] {
  return rows.map(transformMessageViewRow);
}

/**
 * Transform database user row to User type
 * Handles snake_case to camelCase conversion
 */
export function transformUserRow(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    from: parseInt(row.from, 10) || 0,
    profilePic: row.profile_pic,
    friendGroup: row.friend_group,
  };
}

/**
 * Transform multiple user rows to User array
 */
export function transformUserRows(rows: UserRow[]): User[] {
  return rows.map(transformUserRow);
}
