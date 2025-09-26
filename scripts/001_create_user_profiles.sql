-- Create user profiles table for PSX Intelligence platform
-- This extends the auth.users with additional profile information

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  position text,
  phone text,
  bio text,
  avatar_url text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- RLS policies for user profiles
create policy "user_profiles_select_own"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "user_profiles_insert_own"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "user_profiles_update_own"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "user_profiles_delete_own"
  on public.user_profiles for delete
  using (auth.uid() = id);

-- Admin policy to view all profiles
create policy "admin_view_all_profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );
