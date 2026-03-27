'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Brand, Category, InventoryItemFormData } from '@/types'
import { calcTotalValue, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

type ItemFormProps = {
  initialData?: InventoryItemFormData
  itemId?: string
  brands: Brand[]
  categories: Category[]
  onSuccess: () => void
}

const EMPTY_FORM_DATA: InventoryItemFormData = {
  brand_id: '',
  category_id: '',
  cat_number: '',
  cct: '',
  watts: '',
  color_fixture: '',
  quantity: '',
  unit_price: '',
}

export default function ItemForm({
  initialData,
  itemId,
  brands,
  categories,
  onSuccess,
}: ItemFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState<InventoryItemFormData>(
    initialData || EMPTY_FORM_DATA
  )

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const draftStorageKey = itemId
    ? `inventory-item-form:edit:${itemId}`
    : 'inventory-item-form:add'

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(draftStorageKey)
      if (rawDraft) {
        const parsedDraft = JSON.parse(rawDraft) as InventoryItemFormData
        setFormData(parsedDraft)
      }
    } catch (draftError) {
      console.error('Failed to restore form draft:', draftError)
    } finally {
      setDraftLoaded(true)
    }
  }, [draftStorageKey])

  useEffect(() => {
    if (!draftLoaded) return
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(formData))
    } catch (draftError) {
      console.error('Failed to save form draft:', draftError)
    }
  }, [formData, draftLoaded, draftStorageKey])

  useEffect(() => {
    if (!brands.length || !formData.brand_id) return
    const hasBrand = brands.some((brand) => brand.id === formData.brand_id)
    if (!hasBrand) {
      setFormData((prev) => ({ ...prev, brand_id: '' }))
    }
  }, [brands, formData.brand_id])

  useEffect(() => {
    if (!categories.length || !formData.category_id) return
    const hasCategory = categories.some((category) => category.id === formData.category_id)
    if (!hasCategory) {
      setFormData((prev) => ({ ...prev, category_id: '' }))
    }
  }, [categories, formData.category_id])

  const selectedBrandName = brands.find((brand) => brand.id === formData.brand_id)?.name
  const selectedCategoryName = categories.find((category) => category.id === formData.category_id)?.name
  const safeSelectedBrandId =
    formData.brand_id && brands.some((brand) => brand.id === formData.brand_id)
      ? formData.brand_id
      : ''
  const safeSelectedCategoryId =
    formData.category_id && categories.some((category) => category.id === formData.category_id)
      ? formData.category_id
      : ''

  const quantity = typeof formData.quantity === 'number' ? formData.quantity : 0
  const unitPrice = typeof formData.unit_price === 'number' ? formData.unit_price : 0
  const totalValue = calcTotalValue(quantity, unitPrice)

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    if (!formData.brand_id) return setError('Brand is required'), setIsSaving(false)
    if (!formData.category_id) return setError('Category is required'), setIsSaving(false)
    if (!formData.cat_number.trim()) return setError('Catalog number is required'), setIsSaving(false)
    if (formData.quantity === '' || formData.quantity < 0) return setError('Quantity must be 0 or more'), setIsSaving(false)
    if (formData.unit_price === '' || formData.unit_price < 0) return setError('Unit Price must be 0 or more'), setIsSaving(false)

    try {
      const payload = {
        brand_id: formData.brand_id,
        category_id: formData.category_id,
        cat_number: formData.cat_number,
        cct: formData.cct || null,
        watts: formData.watts === '' ? null : formData.watts,
        color_fixture: formData.color_fixture || null,
        quantity: formData.quantity as number,
        unit_price: formData.unit_price as number,
        updated_at: new Date().toISOString()
      }

      if (itemId) {
        const { error: dbError } = await supabase
          .from('inventory_items')
          .update(payload)
          .eq('id', itemId)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('inventory_items')
          .insert(payload)
        if (dbError) throw dbError
      }

      window.localStorage.removeItem(draftStorageKey)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while saving the item.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brand_id">Brand *</Label>
          <Select
            value={safeSelectedBrandId}
            onValueChange={(val) => setFormData((p) => ({ ...p, brand_id: val || '' }))}
          >
            <SelectTrigger id="brand_id" className="w-full text-base h-12">
              <SelectValue placeholder="Select brand">{selectedBrandName || 'Select brand'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">Category *</Label>
          <Select
            value={safeSelectedCategoryId}
            onValueChange={(val) => setFormData((p) => ({ ...p, category_id: val || '' }))}
          >
            <SelectTrigger id="category_id" className="w-full text-base h-12">
              <SelectValue placeholder="Select category">{selectedCategoryName || 'Select category'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cat_number">Catalog Number *</Label>
          <Input
            id="cat_number"
            name="cat_number"
            placeholder="Catalog number"
            value={formData.cat_number}
            onChange={handleTextChange}
            className="text-base h-12 border-slate-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color_fixture">Color/Fixture Finish</Label>
          <Input
            id="color_fixture"
            name="color_fixture"
            placeholder="Color or fixture finish"
            value={formData.color_fixture}
            onChange={handleTextChange}
            className="text-base h-12 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cct">CCT (Color Temperature)</Label>
          <Input
            id="cct"
            name="cct"
            placeholder="CCT"
            value={formData.cct}
            onChange={handleTextChange}
            className="text-base h-12 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="watts">Power (Watts)</Label>
          <Input
            id="watts"
            name="watts"
            type="number"
            min="0"
            step="any"
            placeholder="Watts"
            value={formData.watts}
            onChange={handleNumberChange}
            className="text-base h-12 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity in Stock *</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleNumberChange}
            className="text-base h-12 border-slate-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_price">Unit Price (₹) *</Label>
          <Input
            id="unit_price"
            name="unit_price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Unit price"
            value={formData.unit_price}
            onChange={handleNumberChange}
            className="text-base h-12 border-slate-300"
            required
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <span className="text-slate-600 font-medium text-lg">Total Stock Value:</span>
        <span className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</span>
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          className="h-12 px-6 text-base border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : itemId ? (
            'Update Item'
          ) : (
            'Save Item'
          )}
        </Button>
      </div>
    </form>
  )
}
