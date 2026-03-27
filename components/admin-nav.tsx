'use client'

import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ArrowLeft, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminNav() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/items/add', label: 'Add Item' },
    { href: '/admin/audit', label: 'Audit Logs' },
    { href: '/admin/brands', label: 'Brands' },
    { href: '/admin/categories', label: 'Categories' },
  ]

  return (
    <nav className="bg-white/95 border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/admin" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-primary">Admin Panel</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-10 h-full">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-base font-semibold ${
                    pathname === link.href
                      ? 'border-primary text-slate-900'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              href="/"
              className="text-base font-medium text-slate-500 hover:text-slate-700 flex items-center mr-2"
            >
              <ArrowLeft className="mr-1.5 h-5 w-5" />
              View Inventory
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-11 px-5 text-base text-slate-700 border-slate-300 hover:bg-slate-100"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-7 w-7" />
              ) : (
                <Menu className="block h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-4 pr-4 py-3 border-l-4 text-lg font-medium ${
                  pathname === link.href
                    ? 'bg-sky-50 border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center pl-4 pr-4 py-3 border-l-4 border-transparent text-lg font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              View Inventory
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            <div className="mt-3 space-y-1 px-4">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full flex justify-center items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
