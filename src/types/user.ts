export type User = {
  id: string;
  username: string;
  profilePic: string;
  email: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

// Database table response type for user table
export type UserRow = {
  id: string;
  username: string;
  profile_pic: string;
  email: string;
  provider: string;
  created_at: string;
  updated_at: string;
};