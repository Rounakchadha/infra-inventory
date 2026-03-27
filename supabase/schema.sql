-- Lighting Inventory Management System — Database Schema
-- Run this in the Supabase SQL Editor before seeding data

-- ─── BRANDS ────────────────────────────────────────────────────────────────
create table if not exists brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamp with time zone default now()
);

-- ─── CATEGORIES ────────────────────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamp with time zone default now()
);

-- ─── INVENTORY ITEMS ───────────────────────────────────────────────────────
create table if not exists inventory_items (
  id            uuid primary key default gen_random_uuid(),
  brand_id      uuid references brands(id) on delete set null,
  category_id   uuid references categories(id) on delete set null,
  cat_number    text not null,
  cct           text,
  watts         numeric,
  color_fixture text,
  quantity      integer not null default 0,
  unit_price    numeric(10,2) not null default 0,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

-- Note: total_value is NOT stored. It is calculated in the frontend as:
--   total_value = quantity * unit_price

-- ─── AUTO-UPDATE updated_at ────────────────────────────────────────────────
-- This trigger keeps updated_at current whenever a row is changed
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at
before update on inventory_items
for each row
execute procedure update_updated_at_column();

-- ─── AUDIT LOGS ───────────────────────────────────────────────────────────
-- Captures create/update/delete activity across core tables with actor context.
create table if not exists audit_logs (
  id            uuid primary key default gen_random_uuid(),
  table_name    text not null,
  record_id     uuid,
  action        text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  actor_user_id uuid,
  actor_email   text,
  changed_at    timestamp with time zone not null default now(),
  old_data      jsonb,
  new_data      jsonb
);

create index if not exists audit_logs_changed_at_idx
  on audit_logs (changed_at desc);

create index if not exists audit_logs_table_record_idx
  on audit_logs (table_name, record_id);

create or replace function log_audit_event()
returns trigger as $$
declare
  v_actor_user_id uuid;
  v_actor_email text;
begin
  -- Available when request is authenticated through Supabase auth JWT.
  v_actor_user_id := auth.uid();
  v_actor_email := current_setting('request.jwt.claim.email', true);

  if (tg_op = 'INSERT') then
    insert into audit_logs (table_name, record_id, action, actor_user_id, actor_email, old_data, new_data)
    values (tg_table_name, new.id, 'INSERT', v_actor_user_id, v_actor_email, null, to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    insert into audit_logs (table_name, record_id, action, actor_user_id, actor_email, old_data, new_data)
    values (tg_table_name, new.id, 'UPDATE', v_actor_user_id, v_actor_email, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    insert into audit_logs (table_name, record_id, action, actor_user_id, actor_email, old_data, new_data)
    values (tg_table_name, old.id, 'DELETE', v_actor_user_id, v_actor_email, to_jsonb(old), null);
    return old;
  end if;

  return null;
end;
$$ language plpgsql;

drop trigger if exists audit_brands_trigger on brands;
create trigger audit_brands_trigger
after insert or update or delete on brands
for each row execute procedure log_audit_event();

drop trigger if exists audit_categories_trigger on categories;
create trigger audit_categories_trigger
after insert or update or delete on categories
for each row execute procedure log_audit_event();

drop trigger if exists audit_inventory_items_trigger on inventory_items;
create trigger audit_inventory_items_trigger
after insert or update or delete on inventory_items
for each row execute procedure log_audit_event();
