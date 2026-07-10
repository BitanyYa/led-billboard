-- ============================================================
-- AWLO Advertising — Quote Requests Table
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ── QUOTE REQUESTS table ────────────────────────────────────
create table if not exists public.quote_requests (
  id                       uuid primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),

  -- Contact
  full_name                text not null,
  company_name             text,
  email                    text not null,
  phone                    text not null,
  preferred_contact_method text not null
                             check (preferred_contact_method in ('phone','email','whatsapp')),

  -- Campaign
  package                  text not null
                             check (package in ('1_week','1_month','3_months','6_months','1_year')),
  business_category        text not null,
  campaign_objective       text not null,

  -- Advertisement
  send_later               boolean not null default false,
  ad_file_url              text,
  ad_file_name             text,

  -- Additional
  preferred_start_date     date,
  special_instructions     text,

  -- Meta
  reference_number         text not null unique,
  status                   text not null default 'new'
                             check (status in ('new','contacted','confirmed','rejected'))
);

-- ── Row Level Security ─────────────────────────────────────
alter table public.quote_requests enable row level security;

-- Anyone (anon) can INSERT a new quote request
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'quote_requests'
    and policyname = 'Anyone can submit quote request'
  ) then
    create policy "Anyone can submit quote request"
      on public.quote_requests for insert
      to anon
      with check (true);
  end if;
end $$;

-- Only authenticated users (future admin) can SELECT / UPDATE
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'quote_requests'
    and policyname = 'Authenticated users can read quote requests'
  ) then
    create policy "Authenticated users can read quote requests"
      on public.quote_requests for select
      to authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'quote_requests'
    and policyname = 'Authenticated users can update quote requests'
  ) then
    create policy "Authenticated users can update quote requests"
      on public.quote_requests for update
      to authenticated
      using (true);
  end if;
end $$;

-- ── Indexes ────────────────────────────────────────────────
create index if not exists idx_quote_requests_email
  on public.quote_requests (email);

create index if not exists idx_quote_requests_status
  on public.quote_requests (status);

create index if not exists idx_quote_requests_created_at
  on public.quote_requests (created_at desc);

-- ── Storage bucket for advertisement files ─────────────────
-- Run this separately if the bucket doesn't exist yet:
--
-- insert into storage.buckets (id, name, public)
-- values ('advertisements', 'advertisements', false)
-- on conflict (id) do nothing;
--
-- create policy "Anon can upload advertisements"
--   on storage.objects for insert
--   to anon
--   with check (bucket_id = 'advertisements');
--
-- create policy "Authenticated users can view advertisements"
--   on storage.objects for select
--   to authenticated
--   using (bucket_id = 'advertisements');
