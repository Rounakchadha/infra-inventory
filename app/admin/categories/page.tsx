// Manage Categories page — admin only
// Add new categories and delete existing ones

'use client'

import AdminNav from '@/components/admin-nav'

export default function CategoriesPage() {
  // TODO: Gemini — same layout as Manage Brands but for categories table
  // Guard: warn if category is used by inventory items before deleting
  return (
    <div>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Categories</h1>
        {/* Add category input */}
        {/* Category list with delete buttons */}
      </main>
    </div>
  )
}
