-- Create user watchlists for tracking favorite stocks

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid references public.watchlists(id) on delete cascade not null,
  ticker_id bigint references psx.tickers(id) not null,
  added_at timestamp with time zone default now(),
  notes text,
  unique(watchlist_id, ticker_id)
);

-- Enable RLS
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;

-- RLS policies for watchlists
create policy "watchlists_select_own"
  on public.watchlists for select
  using (auth.uid() = user_id);

create policy "watchlists_insert_own"
  on public.watchlists for insert
  with check (auth.uid() = user_id);

create policy "watchlists_update_own"
  on public.watchlists for update
  using (auth.uid() = user_id);

create policy "watchlists_delete_own"
  on public.watchlists for delete
  using (auth.uid() = user_id);

-- RLS policies for watchlist items
create policy "watchlist_items_select_own"
  on public.watchlist_items for select
  using (
    exists (
      select 1 from public.watchlists
      where id = watchlist_id and user_id = auth.uid()
    )
  );

create policy "watchlist_items_insert_own"
  on public.watchlist_items for insert
  with check (
    exists (
      select 1 from public.watchlists
      where id = watchlist_id and user_id = auth.uid()
    )
  );

create policy "watchlist_items_update_own"
  on public.watchlist_items for update
  using (
    exists (
      select 1 from public.watchlists
      where id = watchlist_id and user_id = auth.uid()
    )
  );

create policy "watchlist_items_delete_own"
  on public.watchlist_items for delete
  using (
    exists (
      select 1 from public.watchlists
      where id = watchlist_id and user_id = auth.uid()
    )
  );
