'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: { name: string }
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(products.map((p) => p.category?.name).filter(Boolean))]
  const filtered = category === 'all' ? products : products.filter((p) => p.category?.name === category)

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse aspect-[3/4] bg-sand-200/50 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-brown-100/80">
        <p>Tezliklə məhsullar əlavə ediləcək.</p>
        <Link href="/quiz" className="text-accent-rose mt-4 inline-block hover:underline">
          Saç diagnostika quizimizə baxın
        </Link>
      </div>
    )
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-brown-300 text-cream-50'
                  : 'bg-cream-200 text-brown-100 hover:bg-sand-200'
              }`}
            >
              {cat === 'all' ? 'Hamısı' : cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/mehsullar/${product.slug}`}
            className="group block bg-cream-50 rounded-2xl overflow-hidden border border-sand-200/50 hover:shadow-lg transition-all"
          >
            <div className="aspect-[3/4] relative bg-sand-200/30">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sand-400 text-sm">
                  Şəkil yoxdur
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-1 bg-cream-50/90 rounded text-xs font-medium text-brown-100">
                {product.category?.name}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-brown-300 group-hover:text-accent-rose transition-colors">
                {product.name}
              </h3>
              <p className="text-brown-100 text-lg font-medium mt-1">{product.price} ₼</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
