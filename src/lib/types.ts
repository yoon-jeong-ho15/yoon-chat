export type AuthUser = {
  id: string;
  username: string;
  password: string;
  from: string;
  profile_pic: string;
  friend_group: string;
};

export type User = {
  id: string;
  username: string;
  from: number;
  profilePic: string;
  friendGroup: string;
};

// Database view response type for v_message
// Direct mapping from database with snake_case fields
export type MessageViewRow = {
  id: string;
  author_id: string;
  author_username: string;
  author_profile_pic: string;
  recipient_id: string;
  recipient_username: string;
  recipient_profile_pic: string;
  message: string;
  created_at: string;
};

// Database table response type for user table
export type UserRow = {
  id: string;
  username: string;
  from: string;
  profile_pic: string;
  friend_group: string;
};

// Simple Message type for new message system
// Maps to v_message view which includes username fields from joins
export type Message = {
  id: string;
  author: {
    id: string;
    username: string;
    profile_pic: string;
  };
  recipient: {
    id: string;
    username: string;
    profile_pic: string;
  };
  message: string;
  created_at: string;
};
