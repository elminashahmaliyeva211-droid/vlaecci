/**
 * Admin quiz responses - list all
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') return NextResponse.json({ responses: [] })
  try {
    await requireAdmin()
    const responses = await prisma.quizResponse.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ responses })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
