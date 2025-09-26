-- Create user alerts system for price and volume notifications

create table if not exists public.user_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker_id bigint references psx.tickers(id) not null,
  alert_type text not null check (alert_type in ('price_above', 'price_below', 'volume_above', 'volatility_above')),
  threshold_value numeric not null,
  is_active boolean default true,
  triggered_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_alerts enable row level security;

-- RLS policies for user alerts
create policy "user_alerts_select_own"
  on public.user_alerts for select
  using (auth.uid() = user_id);

create policy "user_alerts_insert_own"
  on public.user_alerts for insert
  with check (auth.uid() = user_id);

create policy "user_alerts_update_own"
  on public.user_alerts for update
  using (auth.uid() = user_id);

create policy "user_alerts_delete_own"
  on public.user_alerts for delete
  using (auth.uid() = user_id);
