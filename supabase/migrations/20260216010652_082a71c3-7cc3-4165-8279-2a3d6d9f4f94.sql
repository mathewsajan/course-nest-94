
-- Assign admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('7f367575-c9d1-4bef-853c-633a0125ad67', 'admin')
ON CONFLICT DO NOTHING;

-- Also create their profile if it doesn't exist yet
INSERT INTO public.profiles (id, display_name)
VALUES ('7f367575-c9d1-4bef-853c-633a0125ad67', 'Mathew')
ON CONFLICT (id) DO NOTHING;
