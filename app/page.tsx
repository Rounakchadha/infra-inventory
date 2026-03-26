// Main inventory view page — public, no login required
// The primary page used by office staff daily

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { InventoryItem, Brand, Category } from '@/types'
import { calcTotalValue } from '@/lib/utils'
import SearchFilterBar from '@/components/search-filter-bar'
import InventoryTable from '@/components/inventory-table'
import SummaryBar from '@/components/summary-bar'
import ExportButtons from '@/components/export-buttons'

export default function InventoryPage() {
  const supabase = createClient()

  const [items, setItems] = useState<InventoryItem[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // TODO: Gemini — fetch all inventory_items joined with brands and categories on mount
  // Query: supabase.from('inventory_items').select('*, brand:brands(*), category:categories(*)')

  // TODO: Gemini — apply client-side filtering:
  // Filter by search text across: brand.name, category.name, cat_number, color_fixture
  // Filter by selectedBrand and selectedCategory if set
  const filteredItems = items // replace with real filter logic

  // Total value = sum of (quantity × unit_price) for visible rows only
  const totalValue = filteredItems.reduce(
    (sum, item) => sum + calcTotalValue(item.quantity, item.unit_price),
    0
  )

  // TODO: Gemini — implement full page layout as described in gemini.md
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Lighting Stock Inventory
      </h1>
      {/* SearchFilterBar */}
      {/* SummaryBar */}
      {/* ExportButtons */}
      {/* InventoryTable */}
      {/* Footer link to /admin */}
    </main>
  )
}
