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

  useEffect(() => {
    async function fetchOptions() {
      const [brandsRes, categoriesRes] = await Promise.all([
        supabase.from('brands').select('*').order('name'),
        supabase.from('categories').select('*').order('name')
      ])
      if (brandsRes.data) setBrands(brandsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    }
    fetchOptions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-sm p-5 md:p-7">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Add New Item</h1>
          <ItemForm
            brands={brands}
            categories={categories}
            onSuccess={() => router.push('/admin')}
          />
        </div>
      </main>
    </div>
  )
}
