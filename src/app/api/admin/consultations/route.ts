/**
 * Admin consultations - list all requests
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
  try {
    await requireAdmin()
    const requests = await prisma.consultationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ requests })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
