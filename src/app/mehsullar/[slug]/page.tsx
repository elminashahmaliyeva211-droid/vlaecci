import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ProductDetail } from '@/components/ProductDetail'
import { notFound } from 'next/navigation'
import { serverApiFetch } from '@/lib/api'

export async function generateStaticParams() {
  try {
    const response = await serverApiFetch('/products')
    if (!response.ok) return []

    const data = await response.json()
    return (data.products || []).map((product: { slug: string }) => ({ slug: product.slug }))
  } catch {
    return []
  }
}

export const dynamicParams = true

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const response = await serverApiFetch(`/products/${slug}`)
  if (!response.ok) {
    notFound()
  }

  const data = await response.json()
  const product = data.product

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <ProductDetail product={product} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
