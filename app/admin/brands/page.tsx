// Manage Brands page — admin only
// Add new brands and delete existing ones

'use client'

import AdminNav from '@/components/admin-nav'

export default function BrandsPage() {
  // TODO: Gemini — implement:
  // - Fetch and display all brands from Supabase
  // - Text input + "Add Brand" button to insert a new brand
  // - Delete button per brand with confirmation dialog
  // - Guard: warn if brand is used by inventory items before deleting
  return (
    <div>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Brands</h1>
        {/* Add brand input */}
        {/* Brand list with delete buttons */}
      </main>
    </div>
  )
}
