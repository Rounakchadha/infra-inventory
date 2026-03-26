// SummaryBar — shows count of visible items and total stock value
// Updates automatically as search/filter changes the visible row count

'use client'

import { formatCurrency } from '@/lib/utils'

type SummaryBarProps = {
  itemCount: number
  totalValue: number
}

export default function SummaryBar({ itemCount, totalValue }: SummaryBarProps) {
  return (
    <div className="flex justify-center md:justify-end my-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
      <span className="text-sm md:text-base text-gray-700">
        Showing <span className="font-bold">{itemCount} items</span>
        <span className="mx-3 text-gray-300">|</span>
        Total Stock Value: <span className="font-bold">{formatCurrency(totalValue)}</span>
      </span>
    </div>
  )
}
