create extension if not exists pgcrypto;

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_settings'
      and policyname = 'Settings are not directly queryable by clients'
  ) then
    create policy "Settings are not directly queryable by clients"
      on public.app_settings
      for all
      using (false)
      with check (false);
  end if;
end $$;

