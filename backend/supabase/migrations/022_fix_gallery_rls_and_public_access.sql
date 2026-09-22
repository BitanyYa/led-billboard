-- =============================================================
-- AWLO Advertising — Ensure Gallery Table & Bucket Public Access
-- Run in Supabase SQL Editor after 021_fix_settings_rls_policies.sql
-- =============================================================

-- Ensure Row Level Security is enabled
alter table public.gallery_items enable row level security;


-- Allow anyone (anon + authenticated + public) to select visible gallery items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Public can read visible gallery items'
  ) then
    create policy "Public can read visible gallery items"
      on public.gallery_items for select
      to public
      using (visible = true);
  end if;
end $$;

-- Allow authenticated (admin) users to read all gallery items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can read all gallery items'
  ) then
    create policy "Admin can read all gallery items"
      on public.gallery_items for select
      to authenticated
      using (true);
  end if;
end $$;

-- Allow authenticated (admin) users to insert gallery items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can insert gallery items'
  ) then
    create policy "Admin can insert gallery items'
      on public.gallery_items for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Allow authenticated (admin) users to update gallery items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can update gallery items'
  ) then
    create policy "Admin can update gallery items'
      on public.gallery_items for update
      to authenticated
      using (true);
  end if;
end $$;

-- Allow authenticated (admin) users to delete gallery items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can delete gallery items'
  ) then
    create policy "Admin can delete gallery items"
      on public.gallery_items for delete
      to authenticated
      using (true);
  end if;
end $$;

-- Ensure gallery storage bucket exists and is public
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  524288000,
  array[
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
  ]
)
on conflict (id) do nothing;
