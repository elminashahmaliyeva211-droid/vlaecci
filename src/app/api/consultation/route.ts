/**
 * Consultation request API - POST to save consultation requests
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, hairIssue, notes } = body

    if (!name || !phone || !hairIssue) {
      return NextResponse.json(
        { error: 'Ad, telefon və saç problemi tələb olunur' },
        { status: 400 }
      )
    }

    await prisma.consultationRequest.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        hairIssue: String(hairIssue).trim(),
        notes: notes ? String(notes).trim() : null,
      },
    })

    return NextResponse.json({
      message: 'Müraciətiniz qəbul edildi. Tezliklə sizinlə əlaqə saxlayacağıq.',
    })
  } catch (error) {
    console.error('Consultation POST error:', error)
    return NextResponse.json({ error: 'Müraciət göndərilmədi' }, { status: 500 })
  }
}
