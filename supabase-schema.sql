-- Ejecuta este script en Supabase > SQL Editor.
create table if not exists public.nms_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  name text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nms_records_user_category_idx
  on public.nms_records(user_id, category);

alter table public.nms_records enable row level security;

create policy "Users can read their own records"
  on public.nms_records for select
  using (auth.uid() = user_id);

create policy "Users can insert their own records"
  on public.nms_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own records"
  on public.nms_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own records"
  on public.nms_records for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists nms_records_updated_at on public.nms_records;
create trigger nms_records_updated_at
before update on public.nms_records
for each row execute procedure public.set_updated_at();
