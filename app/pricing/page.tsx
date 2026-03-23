import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PricingCard, type PricingPlan } from '@/components/pricing/PricingCard'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Pricing - FitlyAi',
  description: 'Choose the plan that fits your sleep improvement journey. Silver for the essentials, Gold for full community access.',
}

const plans: PricingPlan[] = [
  {
    name: 'Silver',
    description: 'Perfect for getting started with better sleep',
    price: 29,
    priceLabel: 'one-time',
    features: [
      { text: 'Comprehensive Sleep eBook', included: true },
      { text: 'Personalized sleep assessment results', included: true },
      { text: 'Email support', included: true },
      { text: 'Sleep tracking templates', included: true },
      { text: 'Community access', included: false },
      { text: 'Live Q&A sessions', included: false },
      { text: 'Premium content updates', included: false },
    ],
    ctaText: 'Get Silver',
    ctaHref: '/auth/register?plan=silver',
  },
  {
    name: 'Gold',
    description: 'For those who want the complete experience',
    price: 79,
    priceLabel: 'one-time',
    popular: true,
    features: [
      { text: 'Comprehensive Sleep eBook', included: true },
      { text: 'Personalized sleep assessment results', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Sleep tracking templates', included: true },
      { text: 'Full community access', included: true },
      { text: 'Live Q&A sessions with experts', included: true },
      { text: 'Lifetime premium content updates', included: true },
    ],
    ctaText: 'Get Gold',
    ctaHref: '/auth/register?plan=gold',
  },
]

const faqs = [
  {
    question: 'What\'s included in the Sleep eBook?',
    answer: 'Our comprehensive eBook covers sleep science, personalized strategies, relaxation techniques, bedroom optimization, and actionable worksheets to transform your sleep.',
  },
  {
    question: 'Can I upgrade from Silver to Gold later?',
    answer: 'Yes! You can upgrade anytime by paying the difference. Your previous purchase will be credited toward the Gold plan.',
  },
  {
    question: 'What is the community about?',
    answer: 'The Gold community gives you access to a private forum where members share tips, support each other, and participate in live Q&A sessions with sleep experts.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, contact us for a full refund.',
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Simple, transparent pricing</span>
            </div>
            <h1 className="font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Choose Your Path to Better Sleep
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Both plans include our comprehensive sleep eBook and personalized assessment results. Gold members get exclusive community access.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              {plans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                30-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-3xl font-semibold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-12 space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="font-medium text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
