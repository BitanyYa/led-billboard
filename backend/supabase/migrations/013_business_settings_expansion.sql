-- ============================================================
-- AWLO Advertising — Business Settings Expansion
-- Adds: logo_url, phone_secondary, tiktok, youtube
-- Updates: whatsapp entry (already exists via 006), ensures
--          all business-facing keys are present.
-- Run in Supabase SQL Editor after previous migrations.
-- ============================================================

-- Insert new keys (skip silently if already present)
insert into public.settings (key, value, label, group_name) values
  ('logo_url',         '',                    'Logo URL',              'company'),
  ('phone_secondary',  '',                    'Secondary Phone',       'contact'),
  ('tiktok',           '',                    'TikTok URL',            'social'),
  ('youtube',          '',                    'YouTube URL',           'social')
on conflict (key) do nothing;

-- Ensure whatsapp row exists (was added in 006, but guard here)
insert into public.settings (key, value, label, group_name) values
  ('whatsapp', '+251959155555', 'WhatsApp Number', 'contact')
on conflict (key) do nothing;

-- Make sure company_name is present (was added in 007, guard here)
insert into public.settings (key, value, label, group_name) values
  ('company_name', 'AWLO Advertising', 'Company Name', 'company')
on conflict (key) do nothing;
