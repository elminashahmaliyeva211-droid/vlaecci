'use client'

import Link from 'next/link'
import { MessageCircle, Instagram } from 'lucide-react'

const footerLinks = [
  { href: '/mehsullar', label: 'Məhsullar' },
  { href: '/quiz', label: 'Saç Diagnostikası' },
  { href: '/konsultasiya', label: 'Konsultasiya' },
  { href: '/admin', label: 'Admin' },
]

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+994501234567'
  const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'vlaecci'

  return (
    <footer className="bg-brown-400 text-cream-200 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-medium text-cream-50 mb-4">VLAECCI</div>
            <p className="text-cream-200/80 text-sm max-w-md">
              Dermatoloq təsdiqli saç baxım məhsulları. Saç dökülməsi, zəif saç və yavaş böyümə problemlərinə təbii həll.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-cream-50 mb-4">Keçidlər</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream-200/80 hover:text-cream-50 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-cream-50 mb-4">Əlaqə</h4>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream-200/80 hover:text-cream-50 text-sm transition-colors mb-3"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream-200/80 hover:text-cream-50 text-sm transition-colors"
            >
              <Instagram size={18} />
              @{instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brown-300/30 text-center text-sm text-cream-200/60">
          © {new Date().getFullYear()} VLAECCI. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  )
}
