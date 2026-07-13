-- ============================================================
-- AWLO Advertising — Packages Table
-- Run in Supabase SQL Editor after 013_business_settings_expansion.sql
-- ============================================================

-- ── PACKAGES table ─────────────────────────────────────────
create table if not exists public.packages (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- Display
  name                 text not null,
  description          text,

  -- Pricing
  price                numeric(12, 2) not null default 0,

  -- Campaign details
  duration             text not null,          -- e.g. "1 Week", "1 Month"
  advertisement_length integer not null default 20, -- seconds
  displays_per_day     integer not null default 40,

  -- Visibility & feature flags
  featured             boolean not null default false,
  visible              boolean not null default true,

  -- Ordering
  sort_order           integer not null default 0
);

-- ── Auto-update updated_at ──────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'packages_updated_at'
  ) then
    create trigger packages_updated_at
      before update on public.packages
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ── Indexes ────────────────────────────────────────────────
create index if not exists idx_packages_visible
  on public.packages (visible);

create index if not exists idx_packages_featured
  on public.packages (featured);

create index if not exists idx_packages_sort_order
  on public.packages (sort_order);

-- ── Row Level Security ─────────────────────────────────────
alter table public.packages enable row level security;

-- Anon (public website) can read visible packages
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages'
    and policyname = 'Public can read visible packages'
  ) then
    create policy "Public can read visible packages"
      on public.packages for select
      to anon
      using (visible = true);
  end if;
end $$;

-- Authenticated (admin) can read all packages
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages'
    and policyname = 'Admin can read all packages'
  ) then
    create policy "Admin can read all packages"
      on public.packages for select
      to authenticated
      using (true);
  end if;
end $$;

-- Authenticated (admin) can insert packages
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages'
    and policyname = 'Admin can insert packages'
  ) then
    create policy "Admin can insert packages"
      on public.packages for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Authenticated (admin) can update packages
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages'
    and policyname = 'Admin can update packages'
  ) then
    create policy "Admin can update packages"
      on public.packages for update
      to authenticated
      using (true);
  end if;
end $$;

-- Authenticated (admin) can delete packages
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages'
    and policyname = 'Admin can delete packages'
  ) then
    create policy "Admin can delete packages"
      on public.packages for delete
      to authenticated
      using (true);
  end if;
end $$;

-- ── Seed default packages ──────────────────────────────────
insert into public.packages
  (name, price, duration, advertisement_length, displays_per_day, description, featured, visible, sort_order)
values
  (
    '1 Week',
    47036.00,
    '1 Week',
    20,
    40,
    'Perfect for short-term promotions and trying out LED billboard advertising.',
    false,
    true,
    1
  ),
  (
    '1 Month',
    108460.00,
    '1 Month',
    20,
    40,
    'Most popular choice for businesses looking to build brand awareness.',
    false,
    true,
    2
  ),
  (
    '3 Months',
    291500.00,
    '3 Months',
    20,
    40,
    'Build a strong brand presence with sustained visibility over three months.',
    true,
    true,
    3
  ),
  (
    '6 Months',
    379500.00,
    '6 Months',
    20,
    40,
    'Serious brand exposure with half a year of continuous advertising.',
    false,
    true,
    4
  ),
  (
    '1 Year',
    726000.00,
    '1 Year',
    20,
    40,
    'Dominate your market with a full year of premium LED billboard advertising.',
    false,
    true,
    5
  )
on conflict do nothing;
