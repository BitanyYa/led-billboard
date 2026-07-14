-- ============================================================
-- AWLO Advertising — Rename bonus_minutes → bonus_days
-- Run in Supabase SQL Editor after 018_package_bonus_minutes.sql
-- ============================================================
-- Renames the bonus_minutes column to bonus_days to accurately
-- reflect that the bonus is measured in days of extra airtime,
-- not minutes.
-- ============================================================

alter table public.packages
  rename column bonus_minutes to bonus_days;
