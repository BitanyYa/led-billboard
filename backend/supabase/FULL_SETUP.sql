-- ============================================================
-- AWLO Business Center — Full Database Setup
-- Single-file consolidation of all 19 migrations.
-- Paste this entire file into Supabase → SQL Editor → Run.
-- ============================================================


-- ══════════════════════════════════════════════════════════════
-- 0. EXTENSIONS
-- ══════════════════════════════════════════════════════════════
create extension if not exists "pgcrypto";


-- ══════════════════════════════════════════════════════════════
-- 1. CONTACTS
-- ══════════════════════════════════════════════════════════════
create table if not exists public.contacts (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text        not null,
  email       text        not null,
  phone       text,                          -- nullable (migration 004)
  company     text,
  subject     text        not null default 'General Inquiry', -- migration 003
  message     text        not null,
  status      text        not null default 'new'
                check (status in ('new', 'read', 'replied', 'archived')), -- migration 012
  ip_address  text,                          -- migration 005
  user_agent  text,                          -- migration 005
  admin_notes text                           -- migration 006
);

create index if not exists idx_contacts_status     on public.contacts (status);
create index if not exists idx_contacts_created_at on public.contacts (created_at desc);
create index if not exists idx_contacts_email      on public.contacts (email);

alter table public.contacts enable row level security;

create policy "Anyone can submit contact"
  on public.contacts for insert to anon with check (true);

create policy "Authenticated users can read contacts"
  on public.contacts for select to authenticated using (true);

create policy "Authenticated users can update contacts"
  on public.contacts for update to authenticated using (true);

create policy "Authenticated users can delete contacts"
  on public.contacts for delete to authenticated using (true);


-- ══════════════════════════════════════════════════════════════
-- 2. QUOTE REQUESTS
-- ══════════════════════════════════════════════════════════════
create table if not exists public.quote_requests (
  id                       uuid        primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),
  full_name                text        not null,
  company_name             text,
  email                    text        not null,
  phone                    text        not null,
  preferred_contact_method text        not null
                             check (preferred_contact_method in ('phone','email','whatsapp')),
  package                  text        not null
                             check (package in ('1_week','1_month','3_months','6_months','1_year')),
  business_category        text        not null,
  campaign_objective       text        not null,
  send_later               boolean     not null default false,
  ad_file_url              text,
  ad_file_name             text,
  preferred_start_date     date,
  special_instructions     text,
  reference_number         text        not null unique,
  status                   text        not null default 'pending'
                             check (status in (
                               'pending','under_review','waiting_customer',
                               'waiting_payment','approved','rejected'
                             )),
  admin_notes              text                           -- migration 006
);

create index if not exists idx_quote_requests_email      on public.quote_requests (email);
create index if not exists idx_quote_requests_status     on public.quote_requests (status);
create index if not exists idx_quote_requests_created_at on public.quote_requests (created_at desc);

alter table public.quote_requests enable row level security;

create policy "Anyone can submit quote request"
  on public.quote_requests for insert to anon with check (true);

create policy "Authenticated users can read quote requests"
  on public.quote_requests for select to authenticated using (true);

create policy "Authenticated users can update quote requests"
  on public.quote_requests for update to authenticated using (true);


-- ══════════════════════════════════════════════════════════════
-- 3. QUOTE TIMELINE
-- ══════════════════════════════════════════════════════════════
create table if not exists public.quote_timeline (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  quote_id    uuid        not null references public.quote_requests(id) on delete cascade,
  status      text        not null,
  note        text,
  created_by  text
);

create index if not exists idx_quote_timeline_quote_id
  on public.quote_timeline (quote_id, created_at desc);

alter table public.quote_timeline enable row level security;

create policy "Authenticated users can read timeline"
  on public.quote_timeline for select to authenticated using (true);

create policy "Authenticated users can insert timeline"
  on public.quote_timeline for insert to authenticated with check (true);


-- ══════════════════════════════════════════════════════════════
-- 4. SETTINGS (CMS)
-- ══════════════════════════════════════════════════════════════
create table if not exists public.settings (
  key         text        primary key,
  value       text        not null,
  label       text        not null,
  group_name  text        not null default 'general',
  updated_at  timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Public can read settings"
  on public.settings for select to anon using (true);

create policy "Admin can update settings"
  on public.settings for update to authenticated using (true);

-- Seed all CMS settings
insert into public.settings (key, value, label, group_name) values

  -- Company
  ('company_name',        'AWLO Business Center',                          'Company Name',         'company'),
  ('company_tagline',     'Where Business, Shopping, and Advertising Come Together', 'Company Tagline', 'company'),
  ('company_description', 'AWLO Business Center is a vibrant commercial destination in the heart of Bole Medhanialem, Addis Ababa, bringing together shopping, beauty, dining, professional services, and premium LED billboard advertising.', 'Company Description', 'company'),
  ('logo_url',            '',                                              'Logo URL',             'company'),

  -- Contact
  ('phone',           '+251 959 15 55 55',                                 'Phone Number',         'contact'),
  ('phone_secondary', '',                                                  'Secondary Phone',      'contact'),
  ('whatsapp',        '+251959155555',                                     'WhatsApp Number',      'contact'),
  ('telegram',        '+251959155555',                                     'Telegram',             'contact'),
  ('email',           'awloadvertising@gmail.com',                         'Email Address',        'contact'),
  ('address',         'Awlo Business Center, Bole Medhanialem, Addis Ababa', 'Office Address',    'contact'),
  ('maps_url',        'https://www.google.com/maps/place/Awlo+Business+center/@9.02497,38.74689,17z', 'Google Maps URL', 'contact'),
  ('maps_embed',      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.4522739821397!2d38.74689!3d9.02497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa2de1724cdb233da!2sAwlo%20Business%20center!5e0!3m2!1sen!2set!4v1720000000000', 'Google Maps Embed URL', 'contact'),
  ('website',         'https://www.awloadvertising.com',                   'Website URL',          'general'),

  -- Hours
  ('hours_weekday',  'Mon - Fri: 8:00 AM - 6:00 PM',                      'Weekday Hours',        'hours'),
  ('hours_saturday', 'Sat: 9:00 AM - 4:00 PM',                            'Saturday Hours',       'hours'),
  ('hours_sunday',   'Closed',                                             'Sunday Hours',         'hours'),

  -- Social
  ('facebook',  '#',  'Facebook URL',  'social'),
  ('twitter',   '#',  'Twitter URL',   'social'),
  ('instagram', '#',  'Instagram URL', 'social'),
  ('linkedin',  '#',  'LinkedIn URL',  'social'),
  ('tiktok',    '',   'TikTok URL',    'social'),
  ('youtube',   '',   'YouTube URL',   'social'),

  -- Hero
  ('hero_video_url',   '',  'Hero Billboard Video URL', 'hero'),
  ('hero_headline',    'Where Business, Shopping, and Advertising Come Together', 'Hero Headline', 'hero'),
  ('hero_subheadline', 'Located in the heart of Bole Medhanialem, Addis Ababa, AWLO Business Center is a vibrant commercial destination bringing together shopping, beauty, dining, professional services, and premium LED billboard advertising. Whether you''re visiting to explore businesses or looking to promote your brand, AWLO BC offers opportunities that connect businesses with thousands of people every day.', 'Hero Subheadline', 'hero'),
  ('hero_badge_text',  'AWLO Business Center • Bole Medhanialem', 'Hero Badge Text', 'hero'),
  ('hero_stat1_value', '40x',   'Stat 1 Value', 'hero'),
  ('hero_stat1_label', 'Daily Displays', 'Stat 1 Label', 'hero'),
  ('hero_stat2_value', '10×7m', 'Stat 2 Value', 'hero'),
  ('hero_stat2_label', 'Screen Size',    'Stat 2 Label', 'hero'),
  ('hero_stat3_value', '24/7',  'Stat 3 Value', 'hero'),
  ('hero_stat3_label', 'Visibility',     'Stat 3 Label', 'hero'),

  -- About
  ('about_heading', 'Ethiopia''s Premier LED Billboard Operator',          'About Heading',   'about'),
  ('about_body',    'AWLO Advertising is an Ethiopian company specializing exclusively in digital LED billboard advertising. We own and operate a large, state-of-the-art LED billboard that brings businesses to life with vivid, dynamic displays that no passerby can ignore.', 'About Body Text', 'about'),
  ('about_mission', 'To empower Ethiopian businesses with premium outdoor advertising that delivers measurable impact and brand visibility.', 'Mission Statement', 'about'),
  ('about_vision',  'To become Ethiopia''s most trusted and innovative outdoor digital advertising partner, helping brands achieve impossible visibility.', 'Vision Statement', 'about'),

  -- Billboard specs
  ('billboard_screen_size', '10m × 7m',       'Screen Size',      'billboard'),
  ('billboard_resolution',  '4K Resolution',  'Resolution',       'billboard'),
  ('billboard_ad_duration', '20 Seconds',     'Ad Duration',      'billboard'),
  ('billboard_daily_plays', '40 Times',       'Daily Plays',      'billboard'),
  ('billboard_brightness',  '5000+ Nits',     'Brightness',       'billboard'),
  ('billboard_target',      'All Sizes',      'Target Audience',  'billboard'),

  -- Packages
  ('pkg_1week_price',     'ETB 47,036',               '1 Week Price',       'packages'),
  ('pkg_1week_tagline',   'Try it out',               '1 Week Tagline',     'packages'),
  ('pkg_1month_price',    'ETB 108,460',              '1 Month Price',      'packages'),
  ('pkg_1month_tagline',  'Most popular for starters','1 Month Tagline',    'packages'),
  ('pkg_3months_price',   'ETB 291,500',              '3 Months Price',     'packages'),
  ('pkg_3months_tagline', 'Build your brand presence','3 Months Tagline',   'packages'),
  ('pkg_6months_price',   'ETB 379,500',              '6 Months Price',     'packages'),
  ('pkg_6months_tagline', 'Serious brand exposure',   '6 Months Tagline',   'packages'),
  ('pkg_1year_price',     'ETB 726,000',              '1 Year Price',       'packages'),
  ('pkg_1year_tagline',   'Dominate your market',     '1 Year Tagline',     'packages'),
  ('pkg_vat_note',        'excl. 15% VAT',            'VAT Note',           'packages'),
  ('pkg_ad_duration',     '20-second advertisement',  'Ad Duration Text',   'packages'),
  ('pkg_plays_per_day',   '40 plays per day',         'Plays Per Day Text', 'packages')

on conflict (key) do nothing;


-- ══════════════════════════════════════════════════════════════
-- 5. CAMPAIGNS
-- ══════════════════════════════════════════════════════════════
create table if not exists public.campaigns (
  id                  uuid        primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  campaign_number     text        not null unique,
  reference_number    text        not null,
  quote_request_id    uuid        references public.quote_requests(id) on delete set null,
  customer_name       text        not null,
  company             text,
  package             text        not null
                        check (package in ('1_week','1_month','3_months','6_months','1_year')),
  business_category   text        not null,
  campaign_objective  text        not null,
  ad_file_url         text,
  ad_file_name        text,
  start_date          date,
  end_date            date,
  campaign_status     text        not null default 'ready_for_scheduling'
                        check (campaign_status in (
                          'ready_for_scheduling','scheduled','running',
                          'paused','completed','cancelled'
                        )),
  payment_status      text        not null default 'pending'
                        check (payment_status in (
                          'pending','paid','partially_paid','refunded'
                        )),
  assigned_operator   text,
  admin_notes         text,
  -- Scheduling fields (migration 010)
  display_frequency   integer     not null default 40,
  ad_duration         integer     not null default 20,
  scheduling_notes    text
);

create index if not exists idx_campaigns_quote_request_id on public.campaigns (quote_request_id);
create index if not exists idx_campaigns_campaign_status  on public.campaigns (campaign_status);
create index if not exists idx_campaigns_payment_status   on public.campaigns (payment_status);
create index if not exists idx_campaigns_created_at       on public.campaigns (created_at desc);
create index if not exists idx_campaigns_campaign_number  on public.campaigns (campaign_number);

alter table public.campaigns enable row level security;

create policy "Authenticated users can read campaigns"
  on public.campaigns for select to authenticated using (true);

create policy "Authenticated users can insert campaigns"
  on public.campaigns for insert to authenticated with check (true);

create policy "Authenticated users can update campaigns"
  on public.campaigns for update to authenticated using (true);

create policy "Authenticated users can delete campaigns"
  on public.campaigns for delete to authenticated using (true);

-- Auto-increment campaign number helper
create or replace function public.next_campaign_number()
returns text
language plpgsql
security definer
as $$
declare
  v_year  text := to_char(now(), 'YYYY');
  v_count int;
begin
  select count(*) + 1
    into v_count
    from public.campaigns
   where campaign_number like 'CAM-' || v_year || '-%';
  return 'CAM-' || v_year || '-' || lpad(v_count::text, 4, '0');
end;
$$;


-- ══════════════════════════════════════════════════════════════
-- 6. CAMPAIGN TIMELINE
-- ══════════════════════════════════════════════════════════════
create table if not exists public.campaign_timeline (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  campaign_id uuid        not null references public.campaigns(id) on delete cascade,
  action      text        not null,
  detail      text,
  actor       text        default 'Admin'
);

create index if not exists idx_campaign_timeline_campaign_id
  on public.campaign_timeline (campaign_id);
create index if not exists idx_campaign_timeline_created_at
  on public.campaign_timeline (created_at desc);

alter table public.campaign_timeline enable row level security;

create policy "Authenticated users can manage campaign timeline"
  on public.campaign_timeline for all to authenticated
  using (true) with check (true);


-- ══════════════════════════════════════════════════════════════
-- 7. INTERNAL NOTES
-- ══════════════════════════════════════════════════════════════
create table if not exists public.internal_notes (
  id                uuid        primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  content           text        not null check (char_length(content) > 0),
  author            text        not null default 'Admin',
  quote_request_id  uuid        references public.quote_requests(id) on delete cascade,
  campaign_id       uuid        references public.campaigns(id)       on delete cascade,
  constraint internal_notes_single_parent check (
    (quote_request_id is not null)::int +
    (campaign_id       is not null)::int = 1
  )
);

create index if not exists idx_internal_notes_quote_request_id
  on public.internal_notes (quote_request_id, created_at asc);
create index if not exists idx_internal_notes_campaign_id
  on public.internal_notes (campaign_id, created_at asc);

alter table public.internal_notes enable row level security;

create policy "Authenticated users can read internal notes"
  on public.internal_notes for select to authenticated using (true);

create policy "Authenticated users can insert internal notes"
  on public.internal_notes for insert to authenticated with check (true);

create policy "Authenticated users can delete internal notes"
  on public.internal_notes for delete to authenticated using (true);


-- ══════════════════════════════════════════════════════════════
-- 8. PACKAGES
-- ══════════════════════════════════════════════════════════════

-- Shared updated_at trigger function (used by packages + gallery)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.packages (
  id                   uuid          primary key default gen_random_uuid(),
  created_at           timestamptz   not null default now(),
  updated_at           timestamptz   not null default now(),
  name                 text          not null,
  description          text,
  price                numeric(12,2) not null default 0,
  duration             text          not null,
  advertisement_length integer       not null default 20,
  displays_per_day     integer       not null default 40,
  bonus_days           integer       not null default 0,   -- migration 018 + 019
  featured             boolean       not null default false,
  visible              boolean       not null default true,
  sort_order           integer       not null default 0
);

create trigger packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

create index if not exists idx_packages_visible    on public.packages (visible);
create index if not exists idx_packages_featured   on public.packages (featured);
create index if not exists idx_packages_sort_order on public.packages (sort_order);

alter table public.packages enable row level security;

create policy "Public can read visible packages"
  on public.packages for select to anon using (visible = true);

create policy "Admin can read all packages"
  on public.packages for select to authenticated using (true);

create policy "Admin can insert packages"
  on public.packages for insert to authenticated with check (true);

create policy "Admin can update packages"
  on public.packages for update to authenticated using (true);

create policy "Admin can delete packages"
  on public.packages for delete to authenticated using (true);

-- Seed packages
insert into public.packages
  (name, price, duration, advertisement_length, displays_per_day, bonus_days, description, featured, visible, sort_order)
values
  ('1 Week',   47036.00,  '1 Week',   20, 40,  0, 'Perfect for short-term promotions and trying out LED billboard advertising.',           false, true, 1),
  ('1 Month',  108460.00, '1 Month',  20, 40,  0, 'Most popular choice for businesses looking to build brand awareness.',                  false, true, 2),
  ('3 Months', 291500.00, '3 Months', 20, 40,  5, 'Build a strong brand presence with sustained visibility over three months.',            true,  true, 3),
  ('6 Months', 379500.00, '6 Months', 20, 40, 10, 'Serious brand exposure with half a year of continuous advertising.',                    false, true, 4),
  ('1 Year',   726000.00, '1 Year',   20, 40, 15, 'Dominate your market with a full year of premium LED billboard advertising.',           false, true, 5)
on conflict do nothing;


-- ══════════════════════════════════════════════════════════════
-- 9. GALLERY ITEMS
-- ══════════════════════════════════════════════════════════════
create table if not exists public.gallery_items (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  title        text        not null,
  category     text        not null default 'General',
  file_url     text        not null,
  storage_path text        not null,
  file_type    text        not null,
  file_name    text        not null,
  file_size    bigint,
  visible      boolean     not null default true,
  sort_order   integer     not null default 0
);

create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

create index if not exists idx_gallery_items_visible    on public.gallery_items (visible);
create index if not exists idx_gallery_items_category   on public.gallery_items (category);
create index if not exists idx_gallery_items_sort_order on public.gallery_items (sort_order);

alter table public.gallery_items enable row level security;

create policy "Public can read visible gallery items"
  on public.gallery_items for select to anon using (visible = true);

create policy "Admin can read all gallery items"
  on public.gallery_items for select to authenticated using (true);

create policy "Admin can insert gallery items"
  on public.gallery_items for insert to authenticated with check (true);

create policy "Admin can update gallery items"
  on public.gallery_items for update to authenticated using (true);

create policy "Admin can delete gallery items"
  on public.gallery_items for delete to authenticated using (true);

-- Seed the three static public images
insert into public.gallery_items
  (title, category, file_url, storage_path, file_type, file_name, file_size, visible, sort_order)
values
  ('Night Vibe',          'Night View', '/night-vibe.png',        '', 'image', 'night-vibe.png',        null, true, 1),
  ('Day Light View',      'Day View',   '/daylight-view.png',     '', 'image', 'daylight-view.png',     null, true, 2),
  ('Digital Brilliance',  'General',    '/digital-brilliance.png','', 'image', 'digital-brilliance.png',null, true, 3)
on conflict do nothing;


-- ══════════════════════════════════════════════════════════════
-- 10. STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════════

-- Advertisements bucket (quote request ad file uploads)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'advertisements',
  'advertisements',
  false,
  524288000,   -- 500 MB
  array[
    'image/jpeg','image/jpg','image/png','image/gif','image/webp',
    'video/mp4','video/webm','video/quicktime','video/x-msvideo'
  ]
)
on conflict (id) do nothing;

create policy "Anon can upload advertisements"
  on storage.objects for insert to anon
  with check (bucket_id = 'advertisements');

create policy "Authenticated users can view advertisements"
  on storage.objects for select to authenticated
  using (bucket_id = 'advertisements');

create policy "Authenticated users can delete advertisements"
  on storage.objects for delete to authenticated
  using (bucket_id = 'advertisements');

-- Gallery bucket (admin gallery uploads)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  524288000,   -- 500 MB
  array[
    'image/jpeg','image/jpg','image/png','image/gif','image/webp',
    'video/mp4','video/webm','video/quicktime','video/x-msvideo'
  ]
)
on conflict (id) do nothing;

create policy "Public can read gallery files"
  on storage.objects for select to public
  using (bucket_id = 'gallery');

create policy "Admin can upload gallery files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "Admin can update gallery files"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery');

create policy "Admin can delete gallery files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');


-- ══════════════════════════════════════════════════════════════
-- DONE
-- ══════════════════════════════════════════════════════════════
-- After running this script:
--   1. Go to Supabase → Authentication → Users → Add user
--      and create your admin account.
--   2. Update frontend/.env.local with your new project URL
--      and anon key (see below).
-- ============================================================
