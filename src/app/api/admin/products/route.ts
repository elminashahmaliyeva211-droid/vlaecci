/**
 * Admin products API - full CRUD
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

function parseProduct(p: { images: string; [key: string]: unknown }) {
  const images = typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images
  return { ...p, images: Array.isArray(images) ? images : [] }
}

export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') return NextResponse.json({ products: [] })
  try {
    await requireAdmin()
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ products: products.map(parseProduct) })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { name, slug, description, price, images, categoryId, benefits, isActive } = body

    if (!name || !slug || !description || price == null || !categoryId) {
      return NextResponse.json({ error: 'Name, slug, description, price, categoryId tələb olunur' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: Number(price),
        images: JSON.stringify(Array.isArray(images) ? images : []),
        categoryId,
        benefits: benefits ? JSON.stringify(Array.isArray(benefits) ? benefits : []) : null,
        isActive: isActive !== false,
      },
      include: { category: true },
    })
    return NextResponse.json(parseProduct(product))
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Product create error:', e)
    return NextResponse.json({ error: 'Məhsul yaradılmadı' }, { status: 500 })
  }
}
