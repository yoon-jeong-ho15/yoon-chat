-- Row Level Security Policies for Message Table
-- Execute these in your Supabase SQL Editor

-- Enable RLS on the message table
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Users can read their own conversation with owner
-- Regular users: can see messages where they are author OR owner is author
-- Owner: can see all messages
CREATE POLICY "Users can read their messages with owner"
ON message
FOR SELECT
TO authenticated
USING (
  -- User is the owner (can see all messages)
  auth.uid()::text = current_setting('app.settings.owner_user_id', true)
  OR
  -- User is the author of this message
  author_id = auth.uid()::text
  OR
  -- Message is from the owner to this user
  author_id = current_setting('app.settings.owner_user_id', true)
);

-- Policy 2: INSERT - Any authenticated user can send messages
-- They can only insert messages with their own user ID as author
CREATE POLICY "Users can insert their own messages"
ON message
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()::text
);

-- Policy 3: UPDATE - Only owner can update messages (optional)
CREATE POLICY "Only owner can update messages"
ON message
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = current_setting('app.settings.owner_user_id', true)
)
WITH CHECK (
  auth.uid()::text = current_setting('app.settings.owner_user_id', true)
);

-- Policy 4: DELETE - Only owner can delete messages (optional)
CREATE POLICY "Only owner can delete messages"
ON message
FOR DELETE
TO authenticated
USING (
  auth.uid()::text = current_setting('app.settings.owner_user_id', true)
);

-- Set the owner user ID in database settings
-- Replace 'YOUR_OWNER_USER_ID_HERE' with your actual user UUID
ALTER DATABASE postgres SET app.settings.owner_user_id = 'YOUR_OWNER_USER_ID_HERE';

-- Reload the configuration
SELECT pg_reload_conf();
