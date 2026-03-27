'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { InventoryItem } from '@/types'
import { calcTotalValue, formatCurrency } from '@/lib/utils'
import AdminNav from '@/components/admin-nav'
import InventoryTable from '@/components/inventory-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, Tags, LayoutList, Package } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [items, setItems] = useState<InventoryItem[]>([])
  const [brandsCount, setBrandsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    const [itemsRes, brandsRes] = await Promise.all([
      supabase.from('inventory_items').select('*, brand:brands(*), category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('brands').select('id', { count: 'exact', head: true })
    ])
    
    if (itemsRes.data) setItems(itemsRes.data as InventoryItem[])
    if (brandsRes.count !== null) setBrandsCount(brandsRes.count)
    
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalValue = items.reduce(
    (sum, item) => sum + calcTotalValue(item.quantity, item.unit_price), 0
  )

  const handleEdit = (item: InventoryItem) => {
    router.push(`/admin/items/${item.id}`)
  }

  const handleDelete = async (item: InventoryItem) => {
    if (!window.confirm(`Are you sure you want to delete ${item.cat_number}? This cannot be undone.`)) return
    
    const { error } = await supabase.from('inventory_items').delete().eq('id', item.id)
    if (error) {
      alert('Failed to delete item.')
      console.error(error)
    } else {
      setItems(items.filter(i => i.id !== item.id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/items/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-10 px-4">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </Link>
            <Link href="/admin/brands">
              <Button variant="outline" className="text-slate-700 border-slate-300 shadow-sm h-10 px-4 bg-white/90 hover:bg-slate-100">
                <Tags className="mr-2 h-4 w-4" /> Manage Brands
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="text-slate-700 border-slate-300 shadow-sm h-10 px-4 bg-white/90 hover:bg-slate-100">
                <LayoutList className="mr-2 h-4 w-4" /> Manage Categories
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm border-slate-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Items in Stock</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{items.reduce((sum, item) => sum + item.quantity, 0)}</div>
              <p className="text-xs text-slate-500 mt-1">Across {items.length} unique models</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Brands</CardTitle>
              <Tags className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{brandsCount}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Stock Value</CardTitle>
              <span className="font-bold text-green-500 text-lg">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-white/90 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Inventory Overview</h2>
            </div>
            <div className="p-0 sm:p-6">
              <InventoryTable 
                items={items} 
                showActions={true} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
