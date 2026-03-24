'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Lock, CreditCard } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { addMessage, setIsPaid, setStage, closeCheckoutModal } from '@/features/chatbot/chatbotSlice'

async function downloadPersonalizedPdf(params: {
  userName: string
  planType: 'basic' | 'premium'
  dailyCalories: number
  goal: string
  activity: string
  weight: string
  /** Paid basic: full 7-day section in PDF */
  fullMealPlan?: boolean
}) {
  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: params.userName,
      planType: params.planType,
      dailyCalories: params.dailyCalories,
      goal: params.goal,
      activity: params.activity,
      weight: params.weight,
      fullMealPlan: params.fullMealPlan ?? false,
    }),
  })
  if (!res.ok) throw new Error('PDF generation failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'FitlyAi-PersonalizedPlan.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function CheckoutModal() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const isOpen = useAppSelector((s) => s.chatbot.isCheckoutModalOpen)
  const user = useAppSelector((s) => s.auth.user)
  const planType = useAppSelector((s) => s.chatbot.planType)
  const userAnswers = useAppSelector((s) => s.chatbot.userAnswers)
  const dailyCalories = useAppSelector((s) => s.chatbot.dailyCalories)
  const PRICE = planType === 'basic' ? '$2.00' : '$9.00'

  const [isProcessing, setIsProcessing] = useState(false)
  const [email, setEmail] = useState(user?.email || '')

  if (!isOpen) return null

  function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)

    const firstName = user?.name?.split(' ')[0] ?? 'Guest'
    const userName = user?.name ?? firstName
    const goal = userAnswers.goal ?? 'lose weight'
    const activity = userAnswers.activity ?? 'active'
    const weight = userAnswers.weight ?? '80 kg'
    const cals = dailyCalories ?? 2000

    // Simulate payment processing time
    setTimeout(async () => {
      dispatch(setIsPaid(true))
      dispatch(closeCheckoutModal())
      dispatch(setStage('questioning'))
      if (planType === 'premium') {
        dispatch(addMessage({
          role: 'assistant',
          content: 'Payment successful. Premium access unlocked. You can start chatting now.',
          type: 'text',
        }))
      }

      if (planType === 'basic') {
        try {
          await downloadPersonalizedPdf({
            userName,
            planType: 'basic',
            dailyCalories: cals,
            goal,
            activity,
            weight,
            fullMealPlan: true,
          })
        } catch (err) {
          console.error(err)
        }
        router.push('/')
      }

      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close checkout"
        className="absolute inset-0 cursor-default border-0 bg-black/60 p-0 backdrop-blur-sm"
        onClick={() => dispatch(closeCheckoutModal())}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 md:flex-row">
        
        {/* LEFT COLUMN: Summary (Darker background heavily styling Stripe) */}
        <div className="relative w-full bg-[#f8f9fa] px-6 py-8 md:w-[45%] md:px-8">
          <div className="mx-auto max-w-sm">
            
            <div className="mb-8 flex items-center gap-2">
              <Flame className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold tracking-tight text-gray-900">
                FitlyAi
              </span>
            </div>

            <p className="text-sm font-medium text-gray-500">Subscribe to fit lifestyle</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h1 className="text-4xl font-extrabold text-gray-900">{PRICE}</h1>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">FitlyAi Premium Plan</span>
                  <span className="text-sm text-gray-500">Lifetime access to personalized nutrition</span>
                </div>
                <span className="font-medium text-gray-900">{PRICE}</span>
              </div>
              
              <div className="my-6 border-t border-gray-200" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">{PRICE}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Tax</span>
                <span className="text-sm font-medium text-gray-900">$0.00</span>
              </div>
              
              <div className="my-6 border-t border-gray-200" />
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total due today</span>
                <span className="font-semibold text-gray-900">{PRICE}</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Form */}
        <div className="w-full bg-white px-6 py-8 md:w-[55%] md:px-10">
          <div className="mx-auto max-w-sm pt-2">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Payment details</h2>
            
            <form onSubmit={handlePay} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* Card Information */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Card information</label>
                <div className="overflow-hidden rounded-md border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <div className="relative border-b border-gray-300">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="1234 5678 9123 0000"
                      className="w-full bg-white px-3 py-2.5 pl-10 text-sm focus:outline-none"
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM / YY"
                      className="w-1/2 border-r border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="CVC"
                      className="w-1/2 bg-white px-3 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Name on card */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name on card</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center rounded-md bg-[#0055D4] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#0055D4] focus:ring-offset-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  `Pay ${PRICE}`
                )}
              </button>
              
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
                <Lock className="h-3 w-3" /> Payments are secure and encrypted.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
