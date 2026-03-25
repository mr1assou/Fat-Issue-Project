'use client'

import { useState } from 'react'
import { Flame, Lock, CreditCard } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { addMessage, setIsPaid, setStage, closeCheckoutModal } from '@/features/chatbot/chatbotSlice'

export function CheckoutModal() {
  const dispatch = useAppDispatch()

  const isOpen = useAppSelector((s) => s.chatbot.isCheckoutModalOpen)
  const user = useAppSelector((s) => s.auth.user)
  const PRICE = '$3.99'

  const [isProcessing, setIsProcessing] = useState(false)
  const [email, setEmail] = useState(user?.email || '')
  const [exp, setExp] = useState('')

  if (!isOpen) return null

  function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing time
    setTimeout(async () => {
      dispatch(setIsPaid(true))
      dispatch(closeCheckoutModal())
      dispatch(setStage('questioning'))
      dispatch(addMessage({
        role: 'assistant',
        content: 'Payment successful. Premium access unlocked. You can start chatting now.',
        type: 'text',
      }))

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
      <div className="relative z-10 flex w-full max-w-4xl max-h-[85vh] flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 md:flex-row">
        
        {/* LEFT COLUMN: Summary (Darker background heavily styling Stripe) */}
        <div className="relative w-full shrink-0 bg-[#f8f9fa] px-4 py-4 md:w-[45%] md:px-8 md:py-8">
          <div className="mx-auto max-w-sm">
            
            <div className="mb-3 flex items-center gap-2 md:mb-8">
              <Flame className="h-5 w-5 text-primary md:h-6 md:w-6" />
              <span className="font-serif text-lg font-bold tracking-tight text-gray-900 md:text-xl">
                FitlyAi
              </span>
            </div>

            <p className="text-xs font-medium text-gray-500 md:text-sm">Subscribe to fit lifestyle</p>
            <div className="mt-1 flex items-baseline gap-2 md:mt-2">
              <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">{PRICE}</h1>
            </div>

            <div className="mt-4 space-y-2.5 md:mt-8 md:space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 md:text-base">FitlyAi Premium Plan</span>
                  <span className="text-xs text-gray-500 md:text-sm">Lifetime access to personalized nutrition</span>
                </div>
                <span className="text-sm font-medium text-gray-900 md:text-base">{PRICE}</span>
              </div>
              
              <div className="my-3 border-t border-gray-200 md:my-6" />
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 md:text-sm">Subtotal</span>
                <span className="text-xs font-medium text-gray-900 md:text-sm">{PRICE}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 md:text-sm">Tax</span>
                <span className="text-xs font-medium text-gray-900 md:text-sm">$0.00</span>
              </div>
              
              <div className="my-3 border-t border-gray-200 md:my-6" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 md:text-base">Total due today</span>
                <span className="text-sm font-semibold text-gray-900 md:text-base">{PRICE}</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Form */}
        <div className="w-full shrink-0 bg-white px-4 py-4 md:w-[55%] md:px-10 md:py-8">
          <div className="mx-auto max-w-sm pt-0 md:pt-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl">Payment details</h2>
            
            <form onSubmit={handlePay} className="space-y-3.5 md:space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 md:text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:py-2.5"
                  placeholder="you@example.com"
                />
              </div>

              {/* Card Information */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 md:text-sm">Card information</label>
                <div className="overflow-hidden rounded-md border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <div className="relative border-b border-gray-300">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="1234 5678 9123 0000"
                      className="w-full bg-white px-3 py-2 pl-9 text-sm focus:outline-none md:py-2.5 md:pl-10"
                    />
                    <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 md:left-3" />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="02/31"
                      inputMode="numeric"
                      pattern="[0-9]{2}/[0-9]{2}"
                      value={exp}
                      onChange={(e) => {
                        // Auto-format `0312` -> `03/12`
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                        let formatted = digits
                        if (digits.length > 2) {
                          formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
                        }
                        setExp(formatted)
                      }}
                      className="w-1/2 border-r border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none md:py-2.5"
                    />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="CVC"
                      className="w-1/2 bg-white px-3 py-2 text-sm focus:outline-none md:py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Name on card */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 md:text-sm">Name on card</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:py-2.5"
                  placeholder="John Doe"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="mt-4 flex w-full items-center justify-center rounded-md bg-[#0055D4] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#0055D4] focus:ring-offset-2 disabled:opacity-75 md:mt-6 md:py-3"
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
              
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] text-gray-500 md:mt-4 md:text-xs">
                <Lock className="h-3 w-3" /> Payments are secure and encrypted.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
