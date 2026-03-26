// Admin Dashboard — protected by middleware (requires login)
// Shows summary cards, quick actions, and full inventory table with Edit/Delete

'use client'

import AdminNav from '@/components/admin-nav'
import InventoryTable from '@/components/inventory-table'

export default function AdminDashboard() {
  // TODO: Gemini — fetch all inventory items, brands count, and total stock value
  // Show three summary cards: Total Items | Total Brands | Total Stock Value
  // Show quick action buttons: Add New Item | Manage Brands | Manage Categories
  // Show full inventory table with showActions=true
  // Delete should show AlertDialog confirmation before removing from Supabase
  return (
    <div>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        {/* Summary cards */}
        {/* Quick action buttons */}
        {/* InventoryTable with showActions */}
      </main>
    </div>
  )
}
