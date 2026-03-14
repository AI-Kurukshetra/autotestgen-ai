create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create index if not exists user_roles_role_idx on public.user_roles (role);

alter table public.user_roles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can view their own role'
  ) then
    create policy "Users can view their own role"
      on public.user_roles
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;
