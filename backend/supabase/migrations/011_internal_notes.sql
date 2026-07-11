-- ============================================================
-- AWLO Advertising — Internal Notes Table
-- Run in Supabase SQL Editor after 010_campaign_scheduling.sql
--
-- Replaces the single admin_notes text column on quote_requests
-- and campaigns with a proper multi-note log.
-- The old admin_notes columns are kept for backwards compatibility
-- but are no longer the primary notes surface in the UI.
-- ============================================================

create table if not exists public.internal_notes (
  id                uuid        primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- Content
  content           text        not null check (char_length(content) > 0),

  -- Author (admin display name, free text)
  author            text        not null default 'Admin',

  -- Exactly one of these must be set (enforced by check constraint)
  quote_request_id  uuid        references public.quote_requests(id) on delete cascade,
  campaign_id       uuid        references public.campaigns(id)       on delete cascade,

  constraint internal_notes_single_parent check (
    (quote_request_id is not null)::int +
    (campaign_id       is not null)::int = 1
  )
);

-- ── Indexes ────────────────────────────────────────────────
create index if not exists idx_internal_notes_quote_request_id
  on public.internal_notes (quote_request_id, created_at asc);

create index if not exists idx_internal_notes_campaign_id
  on public.internal_notes (campaign_id, created_at asc);

-- ── Row Level Security ─────────────────────────────────────
-- Notes are private admin data — only authenticated users (admins) can access them.
alter table public.internal_notes enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'internal_notes'
    and policyname  = 'Authenticated users can read internal notes'
  ) then
    create policy "Authenticated users can read internal notes"
      on public.internal_notes for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'internal_notes'
    and policyname  = 'Authenticated users can insert internal notes'
  ) then
    create policy "Authenticated users can insert internal notes"
      on public.internal_notes for insert
      to authenticated
      with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'internal_notes'
    and policyname  = 'Authenticated users can delete internal notes'
  ) then
    create policy "Authenticated users can delete internal notes"
      on public.internal_notes for delete
      to authenticated
      using (true);
  end if;
end $$;

-- No public / anon access — notes never leave the authenticated context.
