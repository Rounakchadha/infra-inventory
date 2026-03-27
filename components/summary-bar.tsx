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
    <div className="flex justify-center md:justify-end p-4 rounded-xl bg-white border border-slate-200 shadow-sm w-full lg:w-auto">
      <span className="text-sm md:text-base text-slate-700">
        Showing <span className="font-bold">{itemCount} items</span>
        <span className="mx-3 text-slate-300">|</span>
        Total Stock Value: <span className="font-bold text-primary">{formatCurrency(totalValue)}</span>
      </span>
    </div>
  )
}
