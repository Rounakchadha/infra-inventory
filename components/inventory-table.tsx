// InventoryTable — displays inventory items in a clean, readable table
// Used on both the public view page and the admin dashboard
// showActions prop adds Edit/Delete buttons (admin only)

'use client'

import { InventoryItem } from '@/types'
import { formatCurrency, calcTotalValue } from '@/lib/utils'

type InventoryTableProps = {
  items: InventoryItem[]
  showActions?: boolean
  onEdit?: (item: InventoryItem) => void
  onDelete?: (item: InventoryItem) => void
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'

export default function InventoryTable({
  items,
  showActions = false,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
        <p className="text-slate-600 text-lg">No items found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <Table className="min-w-max w-full [&_th]:border-r [&_th]:border-slate-200 [&_th:last-child]:border-r-0 [&_td]:border-r [&_td]:border-slate-100 [&_td:last-child]:border-r-0">
        <TableHeader className="bg-slate-100/80">
          <TableRow>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap">Brand</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap">Category</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap">Cat No</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap">CCT</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap text-right">Watts</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap">Color/Fixture</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap text-right">Qty</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap text-right">Unit Price</TableHead>
            <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap text-right">Total Value</TableHead>
            {showActions && <TableHead className="font-semibold text-slate-700 uppercase tracking-wide py-4 px-4 whitespace-nowrap text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="even:bg-slate-50/50 transition-colors hover:bg-sky-50/40">
              <TableCell className="py-3 px-4 whitespace-nowrap">{item.brand?.name || '-'}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap">{item.category?.name || '-'}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">{item.cat_number}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap">{item.cct || '-'}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-right">{item.watts ? `${item.watts}W` : '-'}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap">{item.color_fixture || '-'}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-right font-semibold">{item.quantity}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-right">{formatCurrency(item.unit_price)}</TableCell>
              <TableCell className="py-3 px-4 whitespace-nowrap text-right font-semibold text-primary">
                {formatCurrency(calcTotalValue(item.quantity, item.unit_price))}
              </TableCell>
              {showActions && (
                <TableCell className="py-3 px-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(item)}
                      className="text-slate-700 border-slate-300 hover:bg-slate-100 h-9"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(item)}
                      className="bg-red-600 hover:bg-red-700 text-white h-9"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
