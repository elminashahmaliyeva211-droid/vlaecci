/**
 * Admin login API - POST email + password, returns session cookie
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSession, setAuthCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email və parol tələb olunur' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } })
    if (!admin) {
      return NextResponse.json({ error: 'Email və ya parol səhvdir' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email və ya parol səhvdir' }, { status: 401 })
    }

    const token = await createSession(admin.id, admin.email)
    await setAuthCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 })
  }
}
