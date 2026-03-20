/**
 * Products API - GET all products (public), POST new product (admin only)
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

// Parse images JSON helper
function parseProduct(product: { images: string; [key: string]: unknown }) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images
  return { ...product, images: Array.isArray(images) ? images : [] }
}

export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') return NextResponse.json({ products: [] })
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    const parsed = products.map(parseProduct)
    return NextResponse.json({ products: parsed })
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
