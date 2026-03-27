// Edit Item page — admin only
// Fetches the item by ID, renders ItemForm in update mode

'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Brand, Category, InventoryItem } from '@/types'
import AdminNav from '@/components/admin-nav'
import ItemForm from '@/components/item-form'

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const supabase = createClient()

  const [item, setItem] = useState<InventoryItem | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItemAndOptions() {
      const [itemRes, brandsRes, categoriesRes] = await Promise.all([
        supabase.from('inventory_items').select('*').eq('id', itemId).single(),
        supabase.from('brands').select('*').order('name'),
        supabase.from('categories').select('*').order('name')
      ])

      if (brandsRes.data) setBrands(brandsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (itemRes.data) setItem(itemRes.data as InventoryItem)
      
      setLoading(false)
    }
    fetchItemAndOptions()
  }, [itemId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminNav />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminNav />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Item not found</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-sm p-5 md:p-7">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Item</h1>
          {item && (
            <ItemForm
              itemId={itemId}
              initialData={{
                brand_id: item.brand_id,
                category_id: item.category_id,
                cat_number: item.cat_number,
                cct: item.cct,
                watts: item.watts,
                color_fixture: item.color_fixture,
                quantity: item.quantity,
                unit_price: item.unit_price,
              }}
              brands={brands}
              categories={categories}
              onSuccess={() => router.push('/admin')}
            />
          )}
        </div>
      </main>
    </div>
  )
}
