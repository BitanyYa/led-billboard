-- ============================================================
-- AWLO Advertising — Campaign Scheduling Fields
-- Run in Supabase SQL Editor after 009_campaigns.sql
--
-- Adds internal scheduling metadata to the campaigns table.
-- This data is for planning purposes only — the dashboard
-- does NOT communicate directly with LED billboard hardware.
-- ============================================================

alter table public.campaigns
  add column if not exists display_frequency  integer not null default 40,
  add column if not exists ad_duration        integer not null default 20,
  add column if not exists scheduling_notes   text;

comment on column public.campaigns.display_frequency is
  'Number of times the ad plays per day (internal planning only)';

comment on column public.campaigns.ad_duration is
  'Duration of each advertisement slot in seconds (internal planning only)';

comment on column public.campaigns.scheduling_notes is
  'Internal scheduling notes visible to admin/operators only';
