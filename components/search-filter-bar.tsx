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
  return (
    <div className="flex flex-col md:flex-row gap-4 my-6">
      <div className="relative flex-grow md:w-[60%]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by brand, category, cat number, color..."
          className="pl-10 h-12 text-base rounded-xl border-gray-300 focus:ring-indigo-500 w-full"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:w-[40%]">
        <Select value={selectedBrand} onValueChange={onBrandChange}>
          <SelectTrigger className="w-full h-12 text-base rounded-xl border-gray-300 bg-white">
            <SelectValue placeholder="All Brands" />
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

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full h-12 text-base rounded-xl border-gray-300 bg-white">
            <SelectValue placeholder="All Categories" />
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
