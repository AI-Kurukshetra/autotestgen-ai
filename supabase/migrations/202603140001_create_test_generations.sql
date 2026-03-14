create extension if not exists pgcrypto;

create table if not exists public.test_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null,
  framework text not null,
  language text not null,
  generated_code text not null,
  created_at timestamptz not null default now()
);

create index if not exists test_generations_user_created_at_idx
  on public.test_generations (user_id, created_at desc);

alter table public.test_generations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'test_generations'
      and policyname = 'Users can view their own test generations'
  ) then
    create policy "Users can view their own test generations"
      on public.test_generations
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'test_generations'
      and policyname = 'Users can insert their own test generations'
  ) then
    create policy "Users can insert their own test generations"
      on public.test_generations
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;
