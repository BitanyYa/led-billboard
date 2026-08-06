-- ============================================================
-- AWLO Advertising — Create public-assets storage bucket
-- Run in Supabase SQL Editor after 019_rename_bonus_minutes_to_days.sql
-- ============================================================

-- Create the "public-assets" storage bucket (public reads, admin writes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-assets',
  'public-assets',
  true,     -- public bucket → files served at a predictable URL without a signed token
  524288000, -- 500 MB per file limit
  array[
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
  ]
)
on conflict (id) do nothing;

-- Allow anyone to read objects in the public-assets bucket (public CDN-style access)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Public can read public-assets files'
  ) then
    create policy "Public can read public-assets files"
      on storage.objects for select
      to public
      using (bucket_id = 'public-assets');
  end if;
end $$;

-- Allow authenticated users (admins) to upload to the public-assets bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can upload public-assets files'
  ) then
    create policy "Admin can upload public-assets files"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'public-assets');
  end if;
end $$;

-- Allow authenticated users to update objects (e.g. upsert)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can update public-assets files'
  ) then
    create policy "Admin can update public-assets files"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'public-assets');
  end if;
end $$;

-- Allow authenticated users to delete objects
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can delete public-assets files'
  ) then
    create policy "Admin can delete public-assets files"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'public-assets');
  end if;
end $$;
