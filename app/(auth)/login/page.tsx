// Admin Login page — accessible at /login
// Uses Supabase Auth (email + password)
// On success, redirects to /admin

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

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

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/95 rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-slate-600 text-center mb-6">Sign in to manage inventory records.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Log In'}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
