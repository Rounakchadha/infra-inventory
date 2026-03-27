import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function calcTotalValue(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function exportFilename(extension: 'xlsx' | 'csv'): string {
  const date = new Date().toISOString().split('T')[0]
  return `inventory-export-${date}.${extension}`
}
