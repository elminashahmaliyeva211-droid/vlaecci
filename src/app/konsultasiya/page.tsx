import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ConsultationForm } from '@/components/ConsultationForm'

export default function ConsultationPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-brown-300 mb-2">
            Pulsuz Konsultasiya
          </h1>
          <p className="text-brown-100/80 mb-12">
            Saç probleminiz haqqında məlumat verin, sizinlə əlaqə saxlayacağıq.
          </p>
          <ConsultationForm />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
