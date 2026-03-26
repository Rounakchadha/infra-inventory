// Admin Login page — accessible at /login
// Uses Supabase Auth (email + password)
// On success, redirects to /admin

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  // TODO: Gemini — implement clean centered login card UI:
  // - White card, centered on screen (both vertically and horizontally)
  // - Heading: "Admin Login"
  // - Email input with label
  // - Password input with label
  // - "Log In" button (full width, primary style, shows loading state)
  // - Error message area below button (red text)
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          {/* Email input */}
          {/* Password input */}
          {/* Submit button */}
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </form>
      </div>
    </main>
  )
}
