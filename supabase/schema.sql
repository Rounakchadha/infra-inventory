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
