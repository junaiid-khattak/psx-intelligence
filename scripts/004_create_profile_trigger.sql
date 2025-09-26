-- Auto-create user profile when a new user signs up

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  -- Create a default watchlist for the new user
  insert into public.watchlists (user_id, name, description, is_default)
  values (
    new.id,
    'My Watchlist',
    'Default watchlist for tracking favorite stocks',
    true
  )
  on conflict do nothing;

  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
