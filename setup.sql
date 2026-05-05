-- ============================================================
--  laiys tracker — Supabase setup
--  Run this in the Supabase SQL editor once
-- ============================================================

-- 1. Create mentions table
create table if not exists mentions (
  id          uuid        primary key default gen_random_uuid(),
  username    text        not null,
  type        text        not null check (type in ('w', 'l')),
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- 2. Indexes for leaderboard and feed queries
create index if not exists mentions_type_created_idx
  on mentions (type, created_at desc);

create index if not exists mentions_username_type_idx
  on mentions (username, type);

-- 3. Row-level security (anon key can read, service role can insert)
alter table mentions enable row level security;

create policy "Public read"
  on mentions for select
  using (true);

-- 4. Leaderboard function (called via supabase.rpc)
create or replace function get_leaderboard(mention_type text, lim int default 15)
returns table (username text, mentions bigint)
language sql stable security definer as $$
  select username, count(*) as mentions
  from mentions
  where type = mention_type
  group by username
  order by mentions desc
  limit lim;
$$;

-- 5. Enable real-time on this table
--    (also go to Supabase Dashboard → Database → Replication and toggle mentions ON)
alter publication supabase_realtime add table mentions;
