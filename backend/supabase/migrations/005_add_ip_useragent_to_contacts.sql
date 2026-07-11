-- ============================================================
-- AWLO Advertising — Add ip_address and user_agent to contacts
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

alter table public.contacts
  add column if not exists ip_address text,
  add column if not exists user_agent text;

-- Index for quick lookups by status (admin dashboard)
create index if not exists idx_contacts_status
  on public.contacts (status);

create index if not exists idx_contacts_created_at
  on public.contacts (created_at desc);

create index if not exists idx_contacts_email
  on public.contacts (email);
