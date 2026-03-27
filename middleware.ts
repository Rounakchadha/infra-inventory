// Auth protection is temporarily disabled.
// Re-enable by restoring the Supabase session check below.

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pass all /admin/* requests through without auth check
  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/admin/:path*'],
}
