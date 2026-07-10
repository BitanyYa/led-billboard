-- ============================================================
-- AWLO Advertising — Initial Database Schema
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
create extension if not exists "pgcrypto";

-- ── CONTACTS table ─────────────────────────────────────────
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text not null,
  company     text,
  message     text not null,
  status      text not null default 'new'
                check (status in ('new', 'read', 'replied'))
);

-- ── QUOTES table ───────────────────────────────────────────
create table if not exists public.quotes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text not null,
  company     text,
  package     text not null
                check (package in ('1_week','1_month','3_months','6_months','1_year')),
  start_date  date,
  notes       text,
  status      text not null default 'new'
                check (status in ('new', 'contacted', 'confirmed', 'rejected'))
);

-- ── Row Level Security ─────────────────────────────────────
alter table public.contacts enable row level security;
alter table public.quotes   enable row level security;

-- Allow anyone (anon) to INSERT (submit a form)
create policy "Anyone can submit contact"
  on public.contacts for insert
  to anon
  with check (true);

create policy "Anyone can submit quote"
  on public.quotes for insert
  to anon
  with check (true);

-- Only authenticated users (future admin) can SELECT / UPDATE
create policy "Authenticated users can read contacts"
  on public.contacts for select
  to authenticated
  using (true);

create policy "Authenticated users can update contacts"
  on public.contacts for update
  to authenticated
  using (true);

create policy "Authenticated users can read quotes"
  on public.quotes for select
  to authenticated
  using (true);

create policy "Authenticated users can update quotes"
  on public.quotes for update
  to authenticated
  using (true);
