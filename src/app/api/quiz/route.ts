/**
 * Quiz API - POST to save quiz response and get product recommendations
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

// Map quiz answers to recommended product slugs
const RECOMMENDATION_MAP: Record<string, string[]> = {
  // hairLossLevel_hairType_scalpCondition -> product slugs
  mild_thin_oily: ['serum-growth', 'shampoo-volume'],
  mild_thin_dry: ['serum-growth', 'shampoo-nourishing'],
  mild_thin_normal: ['serum-growth'],
  mild_thin_sensitive: ['serum-gentle', 'shampoo-nourishing'],
  mild_normal_oily: ['serum-growth', 'shampoo-volume'],
  mild_normal_dry: ['serum-nourishing', 'shampoo-nourishing'],
  mild_normal_normal: ['serum-growth'],
  mild_normal_sensitive: ['serum-gentle'],
  mild_thick_oily: ['shampoo-volume'],
  mild_thick_dry: ['shampoo-nourishing'],
  mild_thick_normal: ['serum-growth'],
  mild_thick_sensitive: ['serum-gentle'],
  moderate_thin_oily: ['serum-growth', 'shampoo-volume', 'serum-strength'],
  moderate_thin_dry: ['serum-nourishing', 'shampoo-nourishing'],
  moderate_thin_normal: ['serum-growth', 'shampoo-nourishing'],
  moderate_thin_sensitive: ['serum-gentle', 'shampoo-nourishing'],
  moderate_normal_oily: ['serum-growth', 'shampoo-volume'],
  moderate_normal_dry: ['serum-nourishing', 'shampoo-nourishing'],
  moderate_normal_normal: ['serum-growth'],
  moderate_normal_sensitive: ['serum-gentle'],
  moderate_thick_oily: ['serum-growth', 'shampoo-volume'],
  moderate_thick_dry: ['serum-nourishing'],
  moderate_thick_normal: ['serum-growth'],
  moderate_thick_sensitive: ['serum-gentle'],
  severe_thin_oily: ['serum-growth', 'shampoo-volume'],
  severe_thin_dry: ['serum-nourishing', 'shampoo-nourishing'],
  severe_thin_normal: ['serum-growth', 'serum-nourishing'],
  severe_thin_sensitive: ['serum-gentle', 'shampoo-nourishing'],
  severe_normal_oily: ['serum-growth', 'shampoo-volume'],
  severe_normal_dry: ['serum-nourishing', 'shampoo-nourishing'],
  severe_normal_normal: ['serum-growth'],
  severe_normal_sensitive: ['serum-gentle'],
  severe_thick_oily: ['serum-growth', 'shampoo-volume'],
  severe_thick_dry: ['serum-nourishing'],
  severe_thick_normal: ['serum-growth'],
  severe_thick_sensitive: ['serum-gentle'],
}

function getRecommendations(hairLoss: string, hairType: string, scalp: string): string[] {
  const key = `${hairLoss}_${hairType}_${scalp}` as keyof typeof RECOMMENDATION_MAP
  const slugs = RECOMMENDATION_MAP[key]
  if (slugs) return slugs
  // Default: growth serum
  return ['serum-growth']
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { hairLossLevel, hairType, scalpCondition, email } = body

    if (!hairLossLevel || !hairType || !scalpCondition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slugs = getRecommendations(hairLossLevel, hairType, scalpCondition)

    // Fetch actual products by slug from DB
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs }, isActive: true },
      include: { category: true },
    })

    // Fallback: if no products match slugs, get top products
    const recommendedProducts = products.length > 0
      ? products
      : await prisma.product.findMany({ take: 3, where: { isActive: true }, include: { category: true } })

    const recommendations = recommendedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      category: p.category?.name,
    }))

    // Save quiz response
    await prisma.quizResponse.create({
      data: {
        hairLossLevel,
        hairType,
        scalpCondition,
        recommendations: JSON.stringify(recommendations.map((r) => r.id)),
        email: email || null,
      },
    })

    return NextResponse.json({
      recommendations,
      message: 'Cavablarınız qeydə alındı.',
    })
  } catch (error) {
    console.error('Quiz POST error:', error)
    return NextResponse.json({ error: 'Quiz göndərilmədi' }, { status: 500 })
  }
}
