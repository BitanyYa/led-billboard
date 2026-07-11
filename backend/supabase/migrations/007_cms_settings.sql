-- ============================================================
-- AWLO Advertising — CMS Settings Expansion
-- Run in Supabase SQL Editor after 006_admin_schema.sql
-- ============================================================

insert into public.settings (key, value, label, group_name) values

  -- ── Company ────────────────────────────────────────────────
  ('company_name',        'AWLO Advertising',                              'Company Name',         'company'),
  ('company_tagline',     'Ethiopia''s premier LED billboard advertising company', 'Company Tagline', 'company'),
  ('company_description', 'We help businesses reach thousands of potential customers every day with stunning digital displays at Awlo Business Center.', 'Company Description', 'company'),

  -- ── Hero section ──────────────────────────────────────────
  ('hero_headline',       'Make Your Brand Impossible to Ignore',          'Hero Headline',        'hero'),
  ('hero_subheadline',    'Reach thousands of potential customers every day through premium LED billboard advertising. Your message, bigger and brighter than ever.', 'Hero Subheadline', 'hero'),
  ('hero_badge_text',     'Premium Digital Billboard Advertising',         'Hero Badge Text',      'hero'),
  ('hero_stat1_value',    '40x',                                           'Stat 1 Value',         'hero'),
  ('hero_stat1_label',    'Daily Displays',                                'Stat 1 Label',         'hero'),
  ('hero_stat2_value',    '10×7m',                                         'Stat 2 Value',         'hero'),
  ('hero_stat2_label',    'Screen Size',                                   'Stat 2 Label',         'hero'),
  ('hero_stat3_value',    '24/7',                                          'Stat 3 Value',         'hero'),
  ('hero_stat3_label',    'Visibility',                                    'Stat 3 Label',         'hero'),

  -- ── About section ─────────────────────────────────────────
  ('about_heading',       'Ethiopia''s Premier LED Billboard Operator',    'About Heading',        'about'),
  ('about_body',          'AWLO Advertising is an Ethiopian company specializing exclusively in digital LED billboard advertising. We own and operate a large, state-of-the-art LED billboard that brings businesses to life with vivid, dynamic displays that no passerby can ignore.', 'About Body Text', 'about'),
  ('about_mission',       'To empower Ethiopian businesses with premium outdoor advertising that delivers measurable impact and brand visibility.', 'Mission Statement', 'about'),
  ('about_vision',        'To become Ethiopia''s most trusted and innovative outdoor digital advertising partner, helping brands achieve impossible visibility.', 'Vision Statement', 'about'),

  -- ── Billboard specs ───────────────────────────────────────
  ('billboard_screen_size',   '10m × 7m',     'Screen Size',         'billboard'),
  ('billboard_resolution',    '3600 × 720',   'Resolution',          'billboard'),
  ('billboard_ad_duration',   '20 Seconds',   'Ad Duration',         'billboard'),
  ('billboard_daily_plays',   '40 Times',     'Daily Plays',         'billboard'),
  ('billboard_brightness',    '5000+ Nits',   'Brightness',          'billboard'),
  ('billboard_target',        'All Sizes',    'Target Audience',     'billboard'),

  -- ── Packages ──────────────────────────────────────────────
  ('pkg_1week_price',     'ETB 47,036',   '1 Week Price',            'packages'),
  ('pkg_1week_tagline',   'Try it out',   '1 Week Tagline',          'packages'),
  ('pkg_1month_price',    'ETB 108,460',  '1 Month Price',           'packages'),
  ('pkg_1month_tagline',  'Most popular for starters', '1 Month Tagline', 'packages'),
  ('pkg_3months_price',   'ETB 291,500',  '3 Months Price',          'packages'),
  ('pkg_3months_tagline', 'Build your brand presence', '3 Months Tagline', 'packages'),
  ('pkg_6months_price',   'ETB 379,500',  '6 Months Price',          'packages'),
  ('pkg_6months_tagline', 'Serious brand exposure',    '6 Months Tagline', 'packages'),
  ('pkg_1year_price',     'ETB 726,000',  '1 Year Price',            'packages'),
  ('pkg_1year_tagline',   'Dominate your market',      '1 Year Tagline',  'packages'),
  ('pkg_vat_note',        'excl. 15% VAT','VAT Note',                'packages'),
  ('pkg_ad_duration',     '20-second advertisement',   'Ad Duration Text', 'packages'),
  ('pkg_plays_per_day',   '40 plays per day',          'Plays Per Day Text', 'packages')

on conflict (key) do nothing;
