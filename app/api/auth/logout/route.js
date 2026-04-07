import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function POST(request) {
  const supabase = createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', request.url), {
    status: 303 // 303 Forces POST to redirect as a standard GET request to prevent 405 errors
  })
}

export async function GET(request) {
  const supabase = createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', request.url))
}
