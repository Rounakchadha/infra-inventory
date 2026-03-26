-- Lighting Inventory Management System — Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- This inserts sample brands, categories, and 10 inventory items

-- ─── BRANDS ────────────────────────────────────────────────────────────────
insert into brands (name) values
  ('Vizion'),
  ('Neri'),
  ('Bega'),
  ('Philips'),
  ('Havells');

-- ─── CATEGORIES ────────────────────────────────────────────────────────────
insert into categories (name) values
  ('Downlights'),
  ('Track Lights'),
  ('Wall Lights'),
  ('Ceiling Lights'),
  ('Outdoor Lights');

-- ─── INVENTORY ITEMS ───────────────────────────────────────────────────────
-- We use a DO block so we can look up brand/category IDs by name
do $$
declare
  v_vizion   uuid := (select id from brands where name = 'Vizion');
  v_neri     uuid := (select id from brands where name = 'Neri');
  v_bega     uuid := (select id from brands where name = 'Bega');
  v_philips  uuid := (select id from brands where name = 'Philips');
  v_havells  uuid := (select id from brands where name = 'Havells');

  c_down     uuid := (select id from categories where name = 'Downlights');
  c_track    uuid := (select id from categories where name = 'Track Lights');
  c_wall     uuid := (select id from categories where name = 'Wall Lights');
  c_ceiling  uuid := (select id from categories where name = 'Ceiling Lights');
  c_outdoor  uuid := (select id from categories where name = 'Outdoor Lights');
begin
  insert into inventory_items
    (brand_id, category_id, cat_number, cct, watts, color_fixture, quantity, unit_price)
  values
    (v_vizion,  c_down,    'VIZ-DL-001', '3000K', 9,  'White',      45, 850.00),
    (v_vizion,  c_down,    'VIZ-DL-002', '4000K', 12, 'Black',      30, 1100.00),
    (v_vizion,  c_track,   'VIZ-TL-003', '5000K', 20, 'Black',      12, 4200.00),
    (v_neri,    c_wall,    'NER-WL-010', '3000K', 7,  'Silver',     20, 2200.00),
    (v_neri,    c_track,   'NER-TL-005', '4000K', 15, 'White',      15, 3500.00),
    (v_bega,    c_outdoor, 'BEG-OL-020', '5000K', 20, 'Anthracite', 10, 8500.00),
    (v_bega,    c_wall,    'BEG-WL-015', '3000K', 10, 'Silver',     8,  6200.00),
    (v_philips, c_ceiling, 'PHI-CL-030', '4000K', 18, 'White',      25, 1800.00),
    (v_philips, c_down,    'PHI-DL-008', '3000K', 9,  'White',      60, 650.00),
    (v_havells, c_down,    'HAV-DL-012', '4000K', 12, 'White',      40, 750.00);
end $$;
