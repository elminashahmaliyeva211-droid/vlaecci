/**
 * Admin logout - clears session cookie
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  await clearAuthCookie()
  return NextResponse.json({ success: true })
}
