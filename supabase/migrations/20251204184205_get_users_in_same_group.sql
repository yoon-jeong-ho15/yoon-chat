-- Function to get all users in the same group as the given user (excluding the user themselves)
CREATE OR REPLACE FUNCTION get_users_in_same_group(user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  profile_img TEXT,
  friend_group TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.username,
    u.profile_img,
    u.friend_group,
    u.created_at,
    u.updated_at
  FROM "user" u
  WHERE (
    u.friend_group = (
      SELECT u2.friend_group
      FROM "user" u2
      WHERE u2.id = user_id
    )
    OR u.friend_group = '0'
  )
  AND u.id != user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
