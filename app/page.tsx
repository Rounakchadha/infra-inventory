'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { InventoryItem, Brand, Category } from '@/types'
import { calcTotalValue } from '@/lib/utils'
import SearchFilterBar from '@/components/search-filter-bar'
import InventoryTable from '@/components/inventory-table'
import SummaryBar from '@/components/summary-bar'
import ExportButtons from '@/components/export-buttons'
import Link from 'next/link'

export default function InventoryPage() {
  const supabase = createClient()

  const [items, setItems] = useState<InventoryItem[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsRes, brandsRes, categoriesRes] = await Promise.all([
          supabase.from('inventory_items').select('*, brand:brands(*), category:categories(*)').order('created_at', { ascending: false }),
          supabase.from('brands').select('*').order('name'),
          supabase.from('categories').select('*').order('name'),
        ])
        
        if (itemsRes.error) throw itemsRes.error
        if (brandsRes.error) throw brandsRes.error
        if (categoriesRes.error) throw categoriesRes.error

        setItems(itemsRes.data as InventoryItem[])
        setBrands(brandsRes.data as Brand[])
        setCategories(categoriesRes.data as Category[])
      } catch (err: any) {
        console.error(err)
        setError('Could not load inventory. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = items.filter((item) => {
    const matchesSearch = search === '' || 
      item.brand?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.cat_number.toLowerCase().includes(search.toLowerCase()) ||
      (item.color_fixture && item.color_fixture.toLowerCase().includes(search.toLowerCase()))

    const matchesBrand = selectedBrand === 'all' || item.brand_id === selectedBrand
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory

    return matchesSearch && matchesBrand && matchesCategory
  })

  const totalValue = filteredItems.reduce(
    (sum, item) => sum + calcTotalValue(item.quantity, item.unit_price),
    0
  )

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 min-h-screen">
      <div className="rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm p-5 md:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Lighting Stock Inventory
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Search, filter, and export stock in seconds.
            </p>
          </div>
          <Link href="/admin" className="text-sm font-semibold text-primary hover:text-primary/90 flex items-center bg-sky-50 hover:bg-sky-100 transition-colors px-4 py-2.5 rounded-lg border border-sky-200 w-fit">
          Admin Panel &rarr;
        </Link>
        </div>

        <SearchFilterBar 
          search={search}
          onSearchChange={setSearch}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          brands={brands}
          categories={categories}
        />
      
        {loading ? (
          <div className="flex justify-center items-center py-20 mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center shadow-sm border border-red-200 mt-6">
            {error}
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-6">
              <div className="w-full lg:w-auto">
                <SummaryBar itemCount={filteredItems.length} totalValue={totalValue} />
              </div>
              <div className="w-full lg:w-auto flex lg:justify-end">
                <ExportButtons items={filteredItems} />
              </div>
            </div>
            <InventoryTable items={filteredItems} showActions={false} />
          </>
        )}
      </div>
    </main>
  )
}
