
-- Deny INSERT for regular users on user_roles
CREATE POLICY "Regular users cannot insert into user_roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);

-- Deny UPDATE for regular users on user_roles
CREATE POLICY "Regular users cannot update user_roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Deny DELETE for regular users on user_roles
CREATE POLICY "Regular users cannot delete from user_roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (false);
