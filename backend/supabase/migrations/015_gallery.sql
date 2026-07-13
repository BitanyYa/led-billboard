-- ============================================================
-- AWLO Advertising — Gallery Table + Storage
-- Run in Supabase SQL Editor after 014_packages.sql
-- ============================================================

-- ── GALLERY_ITEMS table ─────────────────────────────────────
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- File info
  title        text not null,
  category     text not null default 'General',
  file_url     text not null,          -- full public URL from Supabase Storage
  storage_path text not null,          -- path inside the bucket, e.g. "gallery/uuid.jpg"
  file_type    text not null,          -- "image" | "video"
  file_name    text not null,          -- original filename for display
  file_size    bigint,                 -- bytes (optional, for display)

  -- Visibility & ordering
  visible      boolean not null default true,
  sort_order   integer not null default 0
);

-- ── Auto-update updated_at ──────────────────────────────────
-- reuse set_updated_at() created in 014_packages.sql
do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'gallery_items_updated_at'
  ) then
    create trigger gallery_items_updated_at
      before update on public.gallery_items
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ── Indexes ────────────────────────────────────────────────
create index if not exists idx_gallery_items_visible
  on public.gallery_items (visible);

create index if not exists idx_gallery_items_category
  on public.gallery_items (category);

create index if not exists idx_gallery_items_sort_order
  on public.gallery_items (sort_order);

-- ── Row Level Security ─────────────────────────────────────
alter table public.gallery_items enable row level security;

-- Anon (public website) can read visible items
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Public can read visible gallery items'
  ) then
    create policy "Public can read visible gallery items"
      on public.gallery_items for select
      to anon
      using (visible = true);
  end if;
end $$;

-- Authenticated (admin) can read all items
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

-- Authenticated (admin) can insert
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can insert gallery items'
  ) then
    create policy "Admin can insert gallery items"
      on public.gallery_items for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Authenticated (admin) can update
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'gallery_items'
    and policyname = 'Admin can update gallery items'
  ) then
    create policy "Admin can update gallery items"
      on public.gallery_items for update
      to authenticated
      using (true);
  end if;
end $$;

-- Authenticated (admin) can delete
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

-- ── Storage bucket ─────────────────────────────────────────
-- Create the "gallery" storage bucket (public reads, admin writes).
-- Run this once; it is safe to run again because of the "if not exists" check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,    -- public bucket → files served at a predictable URL without a signed token
  52428800, -- 50 MB per file
  array[
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
  ]
)
on conflict (id) do nothing;

-- Allow anyone to read objects in the gallery bucket (public CDN-style access)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Public can read gallery files'
  ) then
    create policy "Public can read gallery files"
      on storage.objects for select
      to public
      using (bucket_id = 'gallery');
  end if;
end $$;

-- Allow authenticated users (admins) to upload to the gallery bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can upload gallery files'
  ) then
    create policy "Admin can upload gallery files"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'gallery');
  end if;
end $$;

-- Allow authenticated users to update objects (e.g. upsert)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can update gallery files'
  ) then
    create policy "Admin can update gallery files"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'gallery');
  end if;
end $$;

-- Allow authenticated users to delete objects
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
    and tablename   = 'objects'
    and policyname  = 'Admin can delete gallery files'
  ) then
    create policy "Admin can delete gallery files"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'gallery');
  end if;
end $$;
