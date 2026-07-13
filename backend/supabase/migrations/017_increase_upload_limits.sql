-- ============================================================
-- AWLO Advertising — Increase storage bucket upload limits
-- Run in Supabase SQL Editor after 016_gallery_seed.sql
-- ============================================================
-- Raises the per-file size limit on both storage buckets to
-- 500 MB to accommodate 4K video advertisements.
-- ============================================================

-- advertisements bucket (quote request ad uploads)
update storage.buckets
set file_size_limit = 524288000  -- 500 MB in bytes
where id = 'advertisements';

-- gallery bucket (admin gallery uploads)
update storage.buckets
set file_size_limit = 524288000  -- 500 MB in bytes
where id = 'gallery';
