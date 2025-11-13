-- ============================================
-- Seed Data for Local Development
-- ============================================

-- Insert test users into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '35ad432d-2c37-4f4c-a13a-2ff987fa7888',
    'authenticated',
    'authenticated',
    'test@test.com',
    crypt('test123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"테스트"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda',
    'authenticated',
    'authenticated',
    'admin@admin.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"관리자"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

-- Insert identities for the users
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES
  (
    '35ad432d-2c37-4f4c-a13a-2ff987fa7888',
    '35ad432d-2c37-4f4c-a13a-2ff987fa7888',
    '{"sub":"35ad432d-2c37-4f4c-a13a-2ff987fa7888","email":"test@test.com"}'::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda',
    'f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda',
    '{"sub":"f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda","email":"admin@admin.com"}'::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  );

-- Insert users into public.user table
INSERT INTO "user" (id, username, created_at, updated_at) VALUES
  (
    '35ad432d-2c37-4f4c-a13a-2ff987fa7888',
    '테스트',
    NOW(),
    NOW()
  ),
  (
    'f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda',
    '관리자',
    NOW(),
    NOW()
  );

-- Insert some test messages (optional)
-- Uncomment if you want test messages in the database

INSERT INTO message (author_id, recipient_id, message, created_at) VALUES
  (
    '35ad432d-2c37-4f4c-a13a-2ff987fa7888',
    'f7cf1694-3217-4bf1-bc7e-d1ffe17f3dda',
    '안녕하세요! 테스트 메시지입니다.',
    NOW()
  );

