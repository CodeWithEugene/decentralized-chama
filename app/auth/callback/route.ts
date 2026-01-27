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
      const url = request.headers.get('origin')
      return NextResponse.redirect(`${url}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${request.headers.get('origin')}/auth/error?message=Failed to exchange code for session`
  )
}
