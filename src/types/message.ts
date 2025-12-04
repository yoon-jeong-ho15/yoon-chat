// Database view response type for v_message
// Direct mapping from database with snake_case fields
export type MessageViewRow = {
  id: string;
  author_id: string;
  author_username: string;
  author_profile_img: string;
  recipient_id: string;
  recipient_username: string;
  recipient_profile_img: string;
  message: string;
  created_at: string;
};

// Simple Message type for new message system
// Maps to v_message view which includes username fields from joins
export type Message = {
  id: string;
  author: {
    id: string;
    username: string;
    profile_img: string;
  };
  recipient: {
    id: string;
    username: string;
    profile_img: string;
  };
  message: string;
  created_at: string;
};
