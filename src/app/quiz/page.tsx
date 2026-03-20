import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { QuizForm } from '@/components/QuizForm'

export default function QuizPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-brown-300 mb-2">
            Saç Diagnostikası
          </h1>
          <p className="text-brown-100/80 mb-12">
            3 sadə suala cavab verin və sizin saç tipinizə uyğun məhsulları kəşf edin.
          </p>
          <QuizForm />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
