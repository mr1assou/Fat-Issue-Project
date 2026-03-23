'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/redux/hooks'
import { Header } from '@/components/layout/Header'
import { BasicFunnel } from '@/components/onboarding/BasicFunnel'
import { CheckoutModal } from '@/components/checkout/CheckoutModal'

export default function BasicPlanFunnelPage() {
  const router = useRouter()
  const { planType, isPaid } = useAppSelector((s) => s.chatbot)

  useEffect(() => {
    if (!planType) {
      router.replace('/')
      return
    }
    if (planType !== 'basic') {
      router.replace('/chatbot')
      return
    }
    if (isPaid) {
      router.replace('/')
    }
  }, [planType, isPaid, router])

  if (!planType || planType !== 'basic') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center text-muted-foreground">Loading…</main>
      </div>
    )
  }

  if (isPaid) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center text-muted-foreground">Redirecting…</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <BasicFunnel layout="page" onDismiss={() => router.replace('/')} />
      </main>
      <CheckoutModal />
    </div>
  )
}
