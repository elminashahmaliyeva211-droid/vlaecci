/**
 * Admin discount codes - list & create
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
  try {
    await requireAdmin()
    const codes = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ codes })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { code, percentage, expiresAt } = await req.json()
    if (!code || percentage == null) {
      return NextResponse.json({ error: 'Code və faiz tələb olunur' }, { status: 400 })
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: String(code).toUpperCase().trim(),
        percentage: Number(percentage),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    return NextResponse.json(discount)
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Discount create error:', e)
    return NextResponse.json({ error: 'Kod yaradılmadı' }, { status: 500 })
  }
}
