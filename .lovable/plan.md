

## Hide Creator Access from Students

**Problem:** Every logged-in user sees the "Creator" link in the navbar and can access `/creator` routes. Since you're the only creator, students shouldn't see or access those pages.

**Solution:** Use the existing `user_roles` table and `has_role` database function to gate creator access. You already have the `admin` role in the `app_role` enum -- we'll assign you the `admin` role and use it to control visibility.

---

### Steps

1. **Assign your account the `admin` role** -- Insert a row into `user_roles` for your user ID with role `admin` (done via the Supabase SQL editor or insert tool, since RLS blocks client-side inserts).

2. **Create a `useIsAdmin` hook** -- A small hook that queries `user_roles` to check if the current user has the `admin` role. Caches the result with React Query.

3. **Update the Navbar** -- Only show the "Creator" link when `useIsAdmin()` returns `true`.

4. **Update the ProtectedRoute / Add a CreatorRoute wrapper** -- Create a `CreatorRoute` component that checks `useIsAdmin()` and redirects non-admin users to `/` (or shows a 404). Wrap all `/creator` routes with it.

---

### Technical Details

**New file: `src/hooks/useIsAdmin.ts`**
- Queries `user_roles` table filtering by `auth.uid()` and role `admin`
- Returns `{ isAdmin: boolean, isLoading: boolean }`
- Uses React Query with a long stale time since roles rarely change

**Modified: `src/components/Navbar.tsx`**
- Import `useIsAdmin`
- Conditionally render the "Creator" link only when `isAdmin` is true

**New file: `src/components/CreatorRoute.tsx`**
- Wraps children with an admin check
- Shows loading spinner while checking, redirects to `/` if not admin

**Modified: `src/App.tsx`**
- Wrap `/creator` and `/creator/course/:courseId` routes with `CreatorRoute` instead of just `ProtectedRoute`

**Data insert (via SQL/insert tool):**
- Insert your user ID into `user_roles` with role `admin` (we'll look up your user ID first)

