// Core data types for the inventory management system
// These map directly to Supabase database tables

export type Brand = {
  id: string
  name: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  created_at: string
}

export type InventoryItem = {
  id: string
  brand_id: string
  category_id: string
  cat_number: string
  cct: string
  watts: number
  color_fixture: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  // Joined from Supabase query (brand and category names)
  brand?: Brand
  category?: Category
}

// Used in add/edit forms — allows empty strings for number fields before user types
export type InventoryItemFormData = {
  brand_id: string
  category_id: string
  cat_number: string
  cct: string
  watts: number | ''
  color_fixture: string
  quantity: number | ''
  unit_price: number | ''
}

export type AuditLog = {
  id: string
  table_name: string
  record_id: string | null
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  actor_user_id: string | null
  actor_email: string | null
  changed_at: string
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
}
