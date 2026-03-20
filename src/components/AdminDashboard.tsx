'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  MessageSquare,
  ClipboardList,
  Tag,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react'

type Tab = 'products' | 'consultations' | 'quiz' | 'discounts'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  categoryId?: string
  category?: { name: string }
}
interface Consultation {
  id: string
  name: string
  phone: string
  hairIssue: string
  status: string
  createdAt: string
}
interface QuizResponse {
  id: string
  hairLossLevel: string
  hairType: string
  scalpCondition: string
  email?: string
  createdAt: string
}
interface DiscountCode {
  id: string
  code: string
  percentage: number
  expiresAt: string | null
  isActive: boolean
}

export function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([])
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchData = async () => {
    try {
      const [pRes, cRes, qRes, dRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/consultations'),
        fetch('/api/admin/quiz-responses'),
        fetch('/api/admin/discounts'),
        fetch('/api/admin/categories'),
      ])
      if (pRes.status === 401 || cRes.status === 401) {
        router.push('/admin/login')
        return
      }
      const [pData, cData, qData, dData, catData] = await Promise.all([
        pRes.json(),
        cRes.json(),
        qRes.json(),
        dRes.json(),
        catRes.json(),
      ])
      setProducts(pData.products || [])
      setConsultations(cData.requests || [])
      setQuizResponses(qData.responses || [])
      setDiscounts(dData.codes || [])
      setCategories(catData.categories || [])
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Məhsulu silmək istədiyinizə əminsiniz?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const tabs = [
    { id: 'products' as Tab, label: 'Məhsullar', icon: Package },
    { id: 'consultations' as Tab, label: 'Konsultasiyalar', icon: MessageSquare },
    { id: 'quiz' as Tab, label: 'Quiz cavabları', icon: ClipboardList },
    { id: 'discounts' as Tab, label: 'Endirim kodları', icon: Tag },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-pulse text-brown-100">Yüklənir...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-cream-100 border-b border-sand-200 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-medium text-brown-300">
          VLAECCI Admin
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-brown-100 hover:text-brown-300 text-sm"
        >
          <LogOut size={16} />
          Çıxış
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                tab === t.id
                  ? 'bg-brown-300 text-cream-50'
                  : 'bg-cream-200 text-brown-100 hover:bg-sand-200'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-medium text-brown-300">Məhsullar</h2>
              <button
                onClick={() => { setShowProductForm(true); setEditingProduct(null) }}
                className="flex items-center gap-2 px-4 py-2 bg-brown-300 text-cream-50 rounded-xl text-sm font-medium hover:bg-brown-400"
              >
                <Plus size={18} />
                Yeni məhsul
              </button>
            </div>
            {showProductForm && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onClose={() => { setShowProductForm(false); setEditingProduct(null) }}
                onSave={() => { setShowProductForm(false); fetchData() }}
              />
            )}
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-cream-100 rounded-xl border border-sand-200/50"
                >
                  <div>
                    <div className="font-medium text-brown-300">{p.name}</div>
                    <div className="text-sm text-brown-100">
                      {p.category?.name} • {p.price} ₼
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProduct(p); setShowProductForm(true) }}
                      className="p-2 text-brown-100 hover:text-brown-300"
                      title="Redaktə et"
                    >
                      <Pencil size={18} />
                    </button>
                    <Link
                      href={`/mehsullar/${p.slug}`}
                      target="_blank"
                      className="p-2 text-brown-100 hover:text-brown-300"
                      title="Səhifəyə bax"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'consultations' && (
          <div>
            <h2 className="font-serif text-2xl font-medium text-brown-300 mb-6">Konsultasiya müraciətləri</h2>
            <div className="space-y-3">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-cream-100 rounded-xl border border-sand-200/50"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-brown-300">{c.name}</span>
                    <span className="text-xs text-brown-100">
                      {new Date(c.createdAt).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                  <div className="text-sm text-brown-100">Tel: {c.phone}</div>
                  <div className="text-sm text-brown-100/80 mt-1">{c.hairIssue}</div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                    c.status === 'completed' ? 'bg-accent-sage/20' : 'bg-sand-200'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 className="font-serif text-2xl font-medium text-brown-300 mb-6">Quiz cavabları</h2>
            <div className="space-y-3">
              {quizResponses.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-cream-100 rounded-xl border border-sand-200/50"
                >
                  <div className="flex justify-between text-sm">
                    <span>Dökülmə: {q.hairLossLevel}</span>
                    <span>Tip: {q.hairType}</span>
                    <span>Saçlı dəri: {q.scalpCondition}</span>
                  </div>
                  {q.email && <div className="text-xs text-brown-100 mt-1">{q.email}</div>}
                  <div className="text-xs text-brown-100/70 mt-1">
                    {new Date(q.createdAt).toLocaleString('az-AZ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'discounts' && (
          <div>
            <h2 className="font-serif text-2xl font-medium text-brown-300 mb-6">Endirim kodları</h2>
            <DiscountForm onSave={fetchData} />
            <div className="mt-6 space-y-3">
              {discounts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-4 bg-cream-100 rounded-xl border border-sand-200/50"
                >
                  <div>
                    <span className="font-mono font-medium">{d.code}</span>
                    <span className="ml-2 text-brown-100">{d.percentage}%</span>
                  </div>
                  <span className={`text-xs ${d.isActive ? 'text-accent-sage' : 'text-brown-100'}`}>
                    {d.isActive ? 'Aktiv' : 'Deaktiv'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple product form - for MVP we use minimal fields
function ProductForm({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null
  categories: { id: string; name: string }[]
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [description, setDescription] = useState((product as { description?: string })?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId((product as { categoryId?: string })?.categoryId || categories[0].id)
    }
  }, [categories, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          description,
          price: Number(price),
          images: [],
          categoryId: categoryId || categories[0]?.id,
        }),
      })
      if (!res.ok) throw new Error('Xəta')
      onSave()
    } catch {
      alert('Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-cream-100 rounded-2xl border border-sand-200/50">
      <h3 className="font-medium text-brown-300 mb-4">{product ? 'Məhsulu redaktə et' : 'Yeni məhsul'}</h3>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-brown-100 mb-1">Ad</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-sand-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-brown-100 mb-1">Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="serum-growth"
            className="w-full px-4 py-2 rounded-lg border border-sand-200"
          />
        </div>
        <div>
          <label className="block text-sm text-brown-100 mb-1">Təsvir</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-sand-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-brown-100 mb-1">Qiymət (₼)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-sand-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-brown-100 mb-1">Kateqoriya *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-sand-200"
            required
          >
            <option value="">Seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-brown-300 text-cream-50 rounded-lg text-sm">
          {loading ? 'Saxlanılır...' : 'Saxla'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 border border-sand-200 rounded-lg text-sm">
          Ləğv et
        </button>
      </div>
    </form>
  )
}

function DiscountForm({ onSave }: { onSave: () => void }) {
  const [code, setCode] = useState('')
  const [percentage, setPercentage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, percentage: Number(percentage) }),
      })
      if (!res.ok) throw new Error('Xəta')
      setCode('')
      setPercentage('')
      onSave()
    } catch {
      alert('Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="KOD15"
        className="px-4 py-2 rounded-lg border border-sand-200"
        required
      />
      <input
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        placeholder="15"
        className="w-20 px-4 py-2 rounded-lg border border-sand-200"
        required
      />
      <span className="self-center text-brown-100">%</span>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-brown-300 text-cream-50 rounded-lg text-sm">
        Yarat
      </button>
    </form>
  )
}
