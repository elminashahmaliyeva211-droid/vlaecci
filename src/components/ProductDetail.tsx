'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'
import { DiscountCodeInput } from './DiscountCodeInput'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    benefits: string[]
    category: { name: string }
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const mainImage = product.images?.[0] || ''

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <Link
        href="/mehsullar"
        className="inline-flex items-center gap-2 text-brown-100 hover:text-brown-300 mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Məhsullara qayıt
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-sand-200/30 relative">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sand-400">
              Şəkil yoxdur
            </div>
          )}
        </div>

        <div>
          <span className="text-sm text-accent-rose font-medium">{product.category?.name}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-brown-300 mt-1 mb-4">
            {product.name}
          </h1>
          <p className="text-4xl font-medium text-brown-300 mb-6">{product.price} ₼</p>

          <p className="text-brown-100/90 leading-relaxed mb-8">{product.description}</p>

          {product.benefits?.length > 0 && (
            <ul className="space-y-2 mb-8">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-brown-100">
                  <Check size={18} className="text-accent-sage flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mb-6">
            <p className="text-sm text-brown-100 mb-2">Endirim kodunuz var?</p>
            <DiscountCodeInput
              onValid={(code, pct) => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('vlaecci_discount', JSON.stringify({ code, percentage: pct }))
                }
              }}
            />
          </div>

          <a
            href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+994501234567').replace(/\D/g, '')}?text=${encodeURIComponent(`${product.name} - ${product.price} ₼ haqqında sifariş vermək istəyirəm.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-brown-300 text-cream-50 rounded-full font-medium hover:bg-brown-400 transition-colors"
          >
            WhatsApp ilə sifariş ver
          </a>
        </div>
      </div>
    </div>
  )
}
