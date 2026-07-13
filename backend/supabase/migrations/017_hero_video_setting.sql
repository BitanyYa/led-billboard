-- ============================================================
-- AWLO Advertising — Add hero_video_url setting
-- Run in Supabase SQL Editor after 016_gallery_seed.sql
-- ============================================================

insert into public.settings (key, value, label, group_name) values
  ('hero_video_url', '', 'Hero Billboard Video URL', 'hero')
on conflict (key) do nothing;
