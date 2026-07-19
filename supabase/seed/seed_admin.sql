-- Seed an admin after creating the user in Supabase Auth.
-- 1. Create or invite the admin in Supabase Dashboard > Authentication > Users.
-- 2. Copy that auth user's UUID and email.
-- 3. Replace the placeholders below and run this SQL with a privileged connection.

insert into admin_users (user_id, email, role)
values ('00000000-0000-0000-0000-000000000000', 'owner@example.com', 'owner')
on conflict (user_id) do update
set email = excluded.email,
    role = excluded.role;
