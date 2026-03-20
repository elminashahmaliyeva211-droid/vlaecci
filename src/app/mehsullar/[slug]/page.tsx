import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ProductDetail } from '@/components/ProductDetail'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } })
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const dynamicParams = true

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  })
  if (!product) notFound()

  const images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images
  const benefits = typeof product.benefits === 'string' ? JSON.parse(product.benefits || '[]') : product.benefits

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <ProductDetail
          product={{
            ...product,
            images: Array.isArray(images) ? images : [],
            benefits: Array.isArray(benefits) ? benefits : [],
          }}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
