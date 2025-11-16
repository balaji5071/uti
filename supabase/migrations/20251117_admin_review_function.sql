-- Admin-only function to hide (soft delete) reviews while bypassing RLS safely.
-- This function must be executed in Supabase SQL (migration runner) to take effect.

create or replace function admin_hide_review(review_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := auth.jwt() ->> 'email';

  if v_email is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1 from public.admin_users au
    where lower(au.email) = lower(v_email)
      and au.role = 'admin'
  ) then
    raise exception 'Not authorized';
  end if;

  update public.reviews
    set is_approved = false
  where id = review_id;

  if not found then
    raise exception 'Review not found';
  end if;

  return true;
end;
$$;
grant execute on function admin_hide_review(uuid) to authenticated;
grants are not valid SQL syntax in this context. Please rewrite the statement as a proper SQL command using GRANT.

