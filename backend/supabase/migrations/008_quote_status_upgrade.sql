-- ============================================================
-- AWLO Advertising — Quote Status Upgrade + Timeline
-- Run in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop the old constraint first (before any data changes)
alter table public.quote_requests
  drop constraint if exists quote_requests_status_check;

-- Step 2: Migrate existing data to new status values
update public.quote_requests set status = 'pending'      where status = 'new';
update public.quote_requests set status = 'under_review' where status = 'contacted';
update public.quote_requests set status = 'approved'     where status = 'confirmed';

-- Step 3: Add the new constraint with all 6 statuses
alter table public.quote_requests
  add constraint quote_requests_status_check
  check (status in (
    'pending','under_review','waiting_customer',
    'waiting_payment','approved','rejected'
  ));

-- Step 4: Create quote timeline table
create table if not exists public.quote_timeline (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quote_requests(id) on delete cascade,
  status      text not null,
  note        text,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_quote_timeline_quote_id
  on public.quote_timeline (quote_id, created_at desc);

-- Step 5: RLS for timeline
alter table public.quote_timeline enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='quote_timeline'
    and policyname='Authenticated users can read timeline') then
    create policy "Authenticated users can read timeline"
      on public.quote_timeline for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='quote_timeline'
    and policyname='Authenticated users can insert timeline') then
    create policy "Authenticated users can insert timeline"
      on public.quote_timeline for insert to authenticated with check (true);
  end if;
end $$;
