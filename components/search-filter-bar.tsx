// SearchFilterBar — search input + brand and category dropdown filters
// All three work together simultaneously (client-side filtering)

'use client'

import { Brand, Category } from '@/types'

type SearchFilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  selectedBrand: string
  onBrandChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  brands: Brand[]
  categories: Category[]
}

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SearchFilterBar({
  search,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedCategory,
  onCategoryChange,
  brands,
  categories,
}: SearchFilterBarProps) {
  const safeSelectedBrand =
    selectedBrand === 'all' || brands.some((brand) => brand.id === selectedBrand)
      ? selectedBrand
      : 'all'
  const safeSelectedCategory =
    selectedCategory === 'all' || categories.some((category) => category.id === selectedCategory)
      ? selectedCategory
      : 'all'

  const selectedBrandLabel =
    safeSelectedBrand === 'all'
      ? 'All Brands'
      : brands.find((brand) => brand.id === safeSelectedBrand)?.name || 'All Brands'
  const selectedCategoryLabel =
    safeSelectedCategory === 'all'
      ? 'All Categories'
      : categories.find((category) => category.id === safeSelectedCategory)?.name || 'All Categories'

  return (
    <div className="flex flex-col md:flex-row gap-4 my-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="relative flex-grow md:w-[60%]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by brand, category, cat number, color..."
          className="pl-10 h-12 text-base rounded-lg border-slate-300 bg-white w-full"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:w-[40%]">
        <Select value={safeSelectedBrand} onValueChange={(val) => onBrandChange(val || '')}>
          <SelectTrigger className="w-full h-12 text-base rounded-lg border-slate-300 bg-white">
            <SelectValue>{selectedBrandLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={safeSelectedCategory} onValueChange={(val) => onCategoryChange(val || '')}>
          <SelectTrigger className="w-full h-12 text-base rounded-lg border-slate-300 bg-white">
            <SelectValue>{selectedCategoryLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
