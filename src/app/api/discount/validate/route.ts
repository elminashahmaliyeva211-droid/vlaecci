/**
 * Public API - validate discount code
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ valid: false }, { status: 400 })

    const discount = await prisma.discountCode.findFirst({
      where: {
        code: String(code).toUpperCase().trim(),
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    if (!discount) {
      return NextResponse.json({ valid: false, message: 'Kod keçərsizdir' })
    }
    return NextResponse.json({
      valid: true,
      percentage: discount.percentage,
      message: `${discount.percentage}% endirim tətbiq edildi`,
    })
  } catch (error) {
    console.error('Discount validate error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
