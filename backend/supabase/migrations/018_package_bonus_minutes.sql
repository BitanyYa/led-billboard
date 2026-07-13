-- ============================================================
-- AWLO Advertising — Package Bonus Minutes
-- Run in Supabase SQL Editor after 017_increase_upload_limits.sql
-- ============================================================
-- Adds a bonus_minutes column to the packages table.
-- Bonus airtime is extra on-screen time rewarded to clients
-- who commit to longer packages:
--   3 Months →  5 bonus minutes
--   6 Months → 10 bonus minutes
--   1 Year   → 15 bonus minutes
--   All others → 0 (no bonus)
-- ============================================================

-- Add column with default 0 (no bonus)
alter table public.packages
  add column if not exists bonus_minutes integer not null default 0;

-- Seed the bonus values for existing packages by duration name
update public.packages set bonus_minutes = 5  where lower(duration) like '%3%month%';
update public.packages set bonus_minutes = 10 where lower(duration) like '%6%month%';
update public.packages set bonus_minutes = 15 where lower(duration) like '%year%';
