/**
 * Single product by slug - GET (public)
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function parseProduct(product: { images: string; [key: string]: unknown }) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images
  return { ...product, images: Array.isArray(images) ? images : [] }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { category: true },
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(parseProduct(product))
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
