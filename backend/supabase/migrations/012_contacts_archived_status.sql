-- ============================================================
-- AWLO Advertising — Add 'archived' to contacts status
-- Run in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop the old constraint
alter table public.contacts
  drop constraint if exists contacts_status_check;

-- Step 2: Add the updated constraint with all 4 statuses
alter table public.contacts
  add constraint contacts_status_check
  check (status in ('new', 'read', 'replied', 'archived'));

-- Step 3: Allow authenticated users to DELETE contacts (for the delete action)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'contacts'
      and policyname = 'Authenticated users can delete contacts'
  ) then
    create policy "Authenticated users can delete contacts"
      on public.contacts for delete
      to authenticated
      using (true);
  end if;
end $$;
