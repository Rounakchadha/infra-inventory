'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'
import AdminNav from '@/components/admin-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Plus } from 'lucide-react'

export default function CategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [adding, setAdding] = useState(false)

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.trim()) return
    setAdding(true)
    const { error } = await supabase.from('categories').insert({ name: newCategory.trim() })
    if (error) {
      alert('Failed to add category')
      console.error(error)
    } else {
      setNewCategory('')
      await fetchCategories()
    }
    setAdding(false)
  }

  async function handleDelete(category: Category) {
    const { count } = await supabase
      .from('inventory_items')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', category.id)
      
    if (count && count > 0) {
      alert(`Cannot delete ${category.name} because it is used by ${count} inventory item(s).`)
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${category.name}?`)) return
    
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    if (error) {
      alert('Failed to delete category')
    } else {
      setCategories(categories.filter((c) => c.id !== category.id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Categories</h1>
        
        <form onSubmit={handleAdd} className="flex gap-3 mb-8">
          <Input 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="h-11 bg-white border-slate-300"
          />
          <Button type="submit" disabled={adding} className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Category
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-white/95 rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200 overflow-hidden backdrop-blur-sm">
            {categories.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No categories found. Add one above.</div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-900">{category.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
