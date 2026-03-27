'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Brand } from '@/types'
import AdminNav from '@/components/admin-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Plus } from 'lucide-react'

export default function BrandsPage() {
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [newBrand, setNewBrand] = useState('')
  const [adding, setAdding] = useState(false)

  async function fetchBrands() {
    setLoading(true)
    const { data } = await supabase.from('brands').select('*').order('name')
    if (data) setBrands(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchBrands()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newBrand.trim()) return
    setAdding(true)
    const { error } = await supabase.from('brands').insert({ name: newBrand.trim() })
    if (error) {
      alert('Failed to add brand')
      console.error(error)
    } else {
      setNewBrand('')
      await fetchBrands()
    }
    setAdding(false)
  }

  async function handleDelete(brand: Brand) {
    const { count } = await supabase
      .from('inventory_items')
      .select('id', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      
    if (count && count > 0) {
      alert(`Cannot delete ${brand.name} because it is used by ${count} inventory item(s).`)
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${brand.name}?`)) return
    
    const { error } = await supabase.from('brands').delete().eq('id', brand.id)
    if (error) {
      alert('Failed to delete brand')
    } else {
      setBrands(brands.filter((b) => b.id !== brand.id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Brands</h1>
        
        <form onSubmit={handleAdd} className="flex gap-3 mb-8">
          <Input 
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Brand name"
            className="h-11 bg-white border-slate-300"
          />
          <Button type="submit" disabled={adding} className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Brand
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-white/95 rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200 overflow-hidden backdrop-blur-sm">
            {brands.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No brands found. Add one above.</div>
            ) : (
              brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-900">{brand.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(brand)}
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
