export type User = {
  id: string;
  username: string;
  profileImg: string;
  email: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

// Database table response type for user table
export type UserRow = {
  id: string;
  username: string;
  profile_img: string;
  email: string;
  provider: string;
  created_at: string;
  updated_at: string;
};
