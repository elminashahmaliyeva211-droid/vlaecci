/**
 * Admin single product - PUT, DELETE
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

function parseProduct(p: { images: string; [key: string]: unknown }) {
  const images = typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images
  return { ...p, images: Array.isArray(images) ? images : [] }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const { name, slug, description, price, images, categoryId, benefits, isActive } = body

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(slug != null && { slug: slug.toLowerCase().replace(/\s+/g, '-') }),
        ...(description != null && { description }),
        ...(price != null && { price: Number(price) }),
        ...(images != null && { images: JSON.stringify(Array.isArray(images) ? images : []) }),
        ...(categoryId != null && { categoryId }),
        ...(benefits != null && { benefits: JSON.stringify(Array.isArray(benefits) ? benefits : []) }),
        ...(isActive != null && { isActive }),
      },
      include: { category: true },
    })
    return NextResponse.json(parseProduct(product))
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Product update error:', e)
    return NextResponse.json({ error: 'Məhsul yenilənmədi' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Product delete error:', e)
    return NextResponse.json({ error: 'Məhsul silinmədi' }, { status: 500 })
  }
}
