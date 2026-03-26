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

  // TODO: Gemini — fetch the item by itemId, and also fetch brands and categories
  // Show a loading state while fetching
  // If item is not found, show a not-found message

  return (
    <div>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Item</h1>
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
      </main>
    </div>
  )
}
