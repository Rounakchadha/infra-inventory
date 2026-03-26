// AdminNav — top navigation bar shown on all /admin/* pages
// Includes links to all admin sections + logout button

'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // TODO: Gemini — implement full nav with:
  // Links: Dashboard | Add Item | Brands | Categories
  // Right side: "← View Inventory" link (goes to /) + "Log Out" button
  // Responsive: collapses on mobile (hamburger or simple stacked layout)
  return <nav />
}
