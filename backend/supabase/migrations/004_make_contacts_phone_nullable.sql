-- ============================================================
-- AWLO Advertising — Make phone nullable in contacts table
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

alter table public.contacts
  alter column phone drop not null;
