-- ============================================================
-- AWLO Advertising — Fix Settings Table RLS Policies
-- Run in Supabase SQL Editor after 020_create_public_assets_bucket.sql
-- ============================================================
-- Adds select, insert, and delete policies for authenticated admins on settings.
-- This ensures that UPSERT operations (which combine insert and update)
-- run successfully without RLS policy violations.
-- ============================================================

-- Allow authenticated users (admins) to select settings
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'settings'
    and policyname = 'Admin can read settings'
  ) then
    create policy "Admin can read settings"
      on public.settings for select
      to authenticated
      using (true);
  end if;
end $$;

-- Allow authenticated users (admins) to insert settings (necessary for upsert)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'settings'
    and policyname = 'Admin can insert settings'
  ) then
    create policy "Admin can insert settings"
      on public.settings for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Allow authenticated users (admins) to delete settings
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'settings'
    and policyname = 'Admin can delete settings'
  ) then
    create policy "Admin can delete settings"
      on public.settings for delete
      to authenticated
      using (true);
  end if;
end $$;
