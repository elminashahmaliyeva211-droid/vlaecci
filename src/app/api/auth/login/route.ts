/**
 * Admin login API - POST email + password, returns session cookie
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth'

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

    const response = NextResponse.json({ success: true })
    response.cookies.set('vlaecci_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Login error:', error)
    const message = error instanceof Error ? error.message : 'Xəta baş verdi'
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Xəta baş verdi' },
      { status: 500 }
    )
  }
}
