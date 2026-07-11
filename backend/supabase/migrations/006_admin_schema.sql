-- ============================================================
-- AWLO Advertising — Admin Schema
-- Run in Supabase SQL Editor after previous migrations
-- ============================================================

-- ── Add admin_notes to contacts ────────────────────────────
alter table public.contacts
  add column if not exists admin_notes text;

-- ── Add admin_notes + notes to quote_requests ─────────────
alter table public.quote_requests
  add column if not exists admin_notes text;

-- ── SETTINGS table ─────────────────────────────────────────
create table if not exists public.settings (
  key         text primary key,
  value       text not null,
  label       text not null,
  group_name  text not null default 'general',
  updated_at  timestamptz not null default now()
);

-- ── Seed default settings ──────────────────────────────────
insert into public.settings (key, value, label, group_name) values
  ('phone',         '+251 959 15 55 55',                      'Phone Number',      'contact'),
  ('whatsapp',      '+251959155555',                           'WhatsApp Number',   'contact'),
  ('telegram',      '+251959155555',                           'Telegram',          'contact'),
  ('email',         'awloadvertising@gmail.com',               'Email Address',     'contact'),
  ('address',       'Awlo Business Center, Bole, Addis Ababa', 'Office Address',   'contact'),
  ('maps_url',      'https://www.google.com/maps/place/Awlo+Business+center/@9.02497,38.74689,17z', 'Google Maps URL', 'contact'),
  ('maps_embed',    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.4522739821397!2d38.74689!3d9.02497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa2de1724cdb233da!2sAwlo%20Business%20center!5e0!3m2!1sen!2set!4v1720000000000', 'Google Maps Embed URL', 'contact'),
  ('hours_weekday', 'Mon - Fri: 8:00 AM - 6:00 PM',           'Weekday Hours',     'hours'),
  ('hours_saturday','Sat: 9:00 AM - 4:00 PM',                  'Saturday Hours',    'hours'),
  ('hours_sunday',  'Closed',                                   'Sunday Hours',      'hours'),
  ('facebook',      '#',                                        'Facebook URL',      'social'),
  ('twitter',       '#',                                        'Twitter URL',       'social'),
  ('instagram',     '#',                                        'Instagram URL',     'social'),
  ('linkedin',      '#',                                        'LinkedIn URL',      'social'),
  ('website',       'https://www.awloadvertising.com',          'Website URL',       'general')
on conflict (key) do nothing;

-- ── RLS for settings ───────────────────────────────────────
alter table public.settings enable row level security;

-- Public can read settings (used by website)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='settings' and policyname='Public can read settings') then
    create policy "Public can read settings"
      on public.settings for select to anon using (true);
  end if;
end $$;

-- Only authenticated (admin) can update
do $$ begin
  if not exists (select 1 from pg_policies where tablename='settings' and policyname='Admin can update settings') then
    create policy "Admin can update settings"
      on public.settings for update to authenticated using (true);
  end if;
end $$;
