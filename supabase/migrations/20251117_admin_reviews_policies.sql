-- Make review management admin-only: SELECT (all), UPDATE and DELETE.
-- Run this in your Supabase project's SQL editor or apply via your migration workflow.

-- Allow authenticated admins (present in admin_users table) to SELECT all reviews
DROP POLICY IF EXISTS "Admins can select all reviews" ON public.reviews;
CREATE POLICY "Admins can select all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (
    exists (
      select 1 from public.admin_users au
      where lower(au.email) = lower(auth.jwt() ->> 'email')
        and au.role = 'admin'
    )
  );

-- Allow authenticated admins to UPDATE reviews (e.g., set is_approved)
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (
    exists (
      select 1 from public.admin_users au
      where lower(au.email) = lower(auth.jwt() ->> 'email')
        and au.role = 'admin'
    )
  )
  WITH CHECK (true);

-- Allow authenticated admins to DELETE reviews
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (
    exists (
      select 1 from public.admin_users au
      where lower(au.email) = lower(auth.jwt() ->> 'email')
        and au.role = 'admin'
    )
  );

-- Note: keep the existing public SELECT policy that shows only approved reviews to public users.
-- After applying this, admin users signed in via Supabase Auth whose email exists in admin_users
-- will be able to view all reviews and perform UPDATE/DELETE actions from the browser.
