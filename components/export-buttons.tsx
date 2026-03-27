// ExportButtons — triggers Excel or CSV download of currently visible inventory
// Exports only the filtered/searched rows, not always the full dataset

'use client'

import { InventoryItem } from '@/types'
import { exportFilename } from '@/lib/utils'

type ExportButtonsProps = {
  items: InventoryItem[]  // currently visible rows to export
}

import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { calcTotalValue } from '@/lib/utils'

export default function ExportButtons({ items }: ExportButtonsProps) {
  const getFlatRows = () => {
    return items.map((item) => ({
      Brand: item.brand?.name ?? '',
      Category: item.category?.name ?? '',
      'Cat Number': item.cat_number,
      CCT: item.cct || '',
      Watts: item.watts || '',
      'Color/Fixture': item.color_fixture || '',
      Quantity: item.quantity,
      'Unit Price (₹)': item.unit_price,
      'Total Value (₹)': calcTotalValue(item.quantity, item.unit_price),
    }))
  }

  const handleExcelExport = () => {
    const rows = getFlatRows()
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    XLSX.writeFile(wb, exportFilename('xlsx'))
  }

  const handleCsvExport = () => {
    const rows = getFlatRows()
    const ws = XLSX.utils.json_to_sheet(rows)
    const csvData = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', exportFilename('csv'))
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      <Button
        onClick={handleExcelExport}
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-[44px] px-5 text-base w-full sm:w-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Excel
      </Button>
      <Button
        onClick={handleCsvExport}
        variant="outline"
        className="border-slate-300 text-slate-700 hover:bg-slate-100 h-[44px] px-5 text-base w-full sm:w-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        Download CSV
      </Button>
    </div>
  )
}
