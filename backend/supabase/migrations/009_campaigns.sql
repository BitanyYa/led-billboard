-- ============================================================
-- AWLO Advertising — Campaigns Table
-- Run in Supabase SQL Editor after 008_quote_status_upgrade.sql
-- ============================================================

-- ── CAMPAIGNS table ────────────────────────────────────────
create table if not exists public.campaigns (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Identifiers
  campaign_number     text not null unique,          -- e.g. CAM-2024-0001
  reference_number    text not null,                 -- copied from quote_request

  -- Linked quote
  quote_request_id    uuid references public.quote_requests(id) on delete set null,

  -- Customer details (denormalized for quick access)
  customer_name       text not null,
  company             text,

  -- Campaign settings
  package             text not null
                        check (package in ('1_week','1_month','3_months','6_months','1_year')),
  business_category   text not null,
  campaign_objective  text not null,

  -- Advertisement file (inherited from quote request)
  ad_file_url         text,
  ad_file_name        text,

  -- Schedule
  start_date          date,
  end_date            date,

  -- Status
  campaign_status     text not null default 'ready_for_scheduling'
                        check (campaign_status in (
                          'ready_for_scheduling',
                          'scheduled',
                          'running',
                          'paused',
                          'completed',
                          'cancelled'
                        )),

  -- Payment
  payment_status      text not null default 'pending'
                        check (payment_status in (
                          'pending',
                          'paid',
                          'partially_paid',
                          'refunded'
                        )),

  -- Operations
  assigned_operator   text,

  -- Admin notes
  admin_notes         text
);

-- ── Indexes ────────────────────────────────────────────────
create index if not exists idx_campaigns_quote_request_id
  on public.campaigns (quote_request_id);

create index if not exists idx_campaigns_campaign_status
  on public.campaigns (campaign_status);

create index if not exists idx_campaigns_payment_status
  on public.campaigns (payment_status);

create index if not exists idx_campaigns_created_at
  on public.campaigns (created_at desc);

create index if not exists idx_campaigns_campaign_number
  on public.campaigns (campaign_number);

-- ── Row Level Security ─────────────────────────────────────
alter table public.campaigns enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'campaigns'
    and policyname = 'Authenticated users can read campaigns'
  ) then
    create policy "Authenticated users can read campaigns"
      on public.campaigns for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'campaigns'
    and policyname = 'Authenticated users can insert campaigns'
  ) then
    create policy "Authenticated users can insert campaigns"
      on public.campaigns for insert
      to authenticated
      with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'campaigns'
    and policyname = 'Authenticated users can update campaigns'
  ) then
    create policy "Authenticated users can update campaigns"
      on public.campaigns for update
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'campaigns'
    and policyname = 'Authenticated users can delete campaigns'
  ) then
    create policy "Authenticated users can delete campaigns"
      on public.campaigns for delete
      to authenticated
      using (true);
  end if;
end $$;

-- ── Helper function: generate campaign number ──────────────
-- Returns the next CAM-YYYY-NNNN number atomically
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

-- ── CAMPAIGN TIMELINE table ────────────────────────────────
-- Run this section together with the campaigns table above.
-- Tracks every admin action taken on a campaign.

create table if not exists public.campaign_timeline (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  action       text not null,          -- e.g. "Updated", "Status changed"
  detail       text,                   -- human-readable summary of what changed
  actor        text default 'Admin'    -- who made the change
);

create index if not exists idx_campaign_timeline_campaign_id
  on public.campaign_timeline (campaign_id);

create index if not exists idx_campaign_timeline_created_at
  on public.campaign_timeline (created_at desc);

alter table public.campaign_timeline enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'campaign_timeline'
    and policyname = 'Authenticated users can manage campaign timeline'
  ) then
    create policy "Authenticated users can manage campaign timeline"
      on public.campaign_timeline for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;
