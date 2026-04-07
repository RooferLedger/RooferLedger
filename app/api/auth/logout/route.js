import { NextResponse } from 'next/server'

export async function POST(request) {
  return NextResponse.redirect(new URL('/login', request.url))
}

export async function GET(request) {
  return NextResponse.redirect(new URL('/login', request.url))
}
