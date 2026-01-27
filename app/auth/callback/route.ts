import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { origin } = new URL(request.url)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  // return the user to an error page with instructions
  const { origin } = new URL(request.url)
  console.error('Auth Callback Error: Code exchange failed or missing code')
  return NextResponse.redirect(`${origin}/auth/error?message=Failed to exchange code for session`)
}
