-- ============================================================
-- AWLO Advertising — Seed existing frontend gallery images
-- Run in Supabase SQL Editor after 015_gallery.sql
-- ============================================================
-- Seeds the three static images that already live in /public
-- into gallery_items so they appear in the admin gallery page
-- and can be managed (title, category, visibility, order).
-- The file_url uses a relative path — Next.js serves /public
-- files at the root, so /night-vibe.png resolves correctly.
-- storage_path is empty for these pre-existing local files
-- (they are not stored in Supabase Storage).
-- ============================================================

insert into public.gallery_items
  (title, category, file_url, storage_path, file_type, file_name, file_size, visible, sort_order)
values
  (
    'Night Vibe',
    'Night View',
    '/night-vibe.png',
    '',
    'image',
    'night-vibe.png',
    null,
    true,
    1
  ),
  (
    'Day Light View',
    'Day View',
    '/daylight-view.png',
    '',
    'image',
    'daylight-view.png',
    null,
    true,
    2
  ),
  (
    'Digital Brilliance',
    'General',
    '/digital-brilliance.png',
    '',
    'image',
    'digital-brilliance.png',
    null,
    true,
    3
  )
on conflict do nothing;
