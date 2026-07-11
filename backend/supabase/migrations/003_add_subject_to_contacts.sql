-- ============================================================
-- AWLO Advertising — Add subject column to contacts table
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

alter table public.contacts
  add column if not exists subject text not null default 'General Inquiry';
