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

-- 6. unlabeled_messages — messages Gemini couldn't confidently classify
create table if not exists unlabeled_messages (
  id          uuid        primary key default gen_random_uuid(),
  username    text        not null,
  message     text        not null,
  created_at  timestamptz not null default now(),
  labeled     boolean     not null default false
);

create index if not exists unlabeled_labeled_idx
  on unlabeled_messages (labeled, created_at asc);

alter table unlabeled_messages enable row level security;

create policy "Public read unlabeled"
  on unlabeled_messages for select
  using (true);

create policy "Public insert unlabeled"
  on unlabeled_messages for insert
  with check (true);

create policy "Public update unlabeled"
  on unlabeled_messages for update
  using (true);

-- 7. training_data — manually labeled messages for future model training
create table if not exists training_data (
  id          uuid        primary key default gen_random_uuid(),
  username    text        not null,
  message     text        not null,
  label       text        not null check (label in ('w', 'l')),
  created_at  timestamptz not null default now(),
  source_id   uuid        references unlabeled_messages(id)
);

alter table training_data enable row level security;

create policy "Public read training"
  on training_data for select
  using (true);

create policy "Public insert training"
  on training_data for insert
  with check (true);
