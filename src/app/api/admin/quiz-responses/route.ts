/**
 * Admin quiz responses - list all
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
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
