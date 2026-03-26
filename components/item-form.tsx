// ItemForm — shared form for adding and editing inventory items
// Used by /admin/items/add and /admin/items/[id]
// Shows live-calculated Total Value as user types quantity and price

'use client'

import { Brand, Category, InventoryItemFormData } from '@/types'

type ItemFormProps = {
  initialData?: InventoryItemFormData
  itemId?: string       // if provided, this is an update (PUT); otherwise insert (POST)
  brands: Brand[]
  categories: Category[]
  onSuccess: () => void
}

export default function ItemForm({
  initialData,
  itemId,
  brands,
  categories,
  onSuccess,
}: ItemFormProps) {
  // TODO: Gemini — implement full form with:
  // - Brand dropdown (from brands prop)
  // - Category dropdown (from categories prop)
  // - Cat Number text input (required)
  // - CCT text input (optional)
  // - Watts number input (optional)
  // - Color/Fixture text input (optional)
  // - Quantity number input (required, min 0)
  // - Unit Price number input (required, min 0, decimal)
  // - Total Value read-only display (auto-calculated: quantity × unit_price in ₹)
  // - Save/Update button with loading spinner
  // - Cancel button
  // - Validation messages for required fields
  // - On success: call onSuccess() and redirect
  return <div />
}
