/**
 * Admin categories API - list & create
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
  // Allow build to complete - Next.js invokes routes during "collect page data" phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ categories: [] })
  }
  try {
    await requireAdmin()
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json({ categories })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { name, slug } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name tələb olunur' }, { status: 400 })

    const slugValue = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const category = await prisma.category.create({
      data: { name, slug: slugValue },
    })
    return NextResponse.json(category)
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Category create error:', e)
    return NextResponse.json({ error: 'Kateqoriya yaradılmadı' }, { status: 500 })
  }
}
