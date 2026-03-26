// Add New Item page — admin only
// Renders ItemForm with no initial data (insert mode)

'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Brand, Category } from '@/types'
import AdminNav from '@/components/admin-nav'
import ItemForm from '@/components/item-form'

export default function AddItemPage() {
  const router = useRouter()
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // TODO: Gemini — fetch brands and categories to populate the form dropdowns

  return (
    <div>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Item</h1>
        <ItemForm
          brands={brands}
          categories={categories}
          onSuccess={() => router.push('/admin')}
        />
      </main>
    </div>
  )
}
