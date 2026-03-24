'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { closeModal, setPlanType, setStage, resetChat, setIsPaid } from '@/features/chatbot/chatbotSlice'
import { loginSuccess } from '@/features/auth/authSlice'
import { Sparkles, X, Check, Zap, Lock } from 'lucide-react'
import { useState } from 'react'

const PRICE = '9$'
const CHATBOT_SESSION_STORAGE_KEY = 'chatbot-session-v1'

const PREMIUM_FEATURES = [
  'Full personalized 7-day plan',
  'Daily calorie & macro breakdown',
  'Downloadable PDF report',
  'Chatbot access + up to 2 customized plan generations',
  'Personalized recommendations',
]

export function GetStartedModal() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isOpen = useAppSelector((s) => s.chatbot.isModalOpen)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const currentUser = useAppSelector((s) => s.auth.user)
  const [loadingPlan, setLoadingPlan] = useState<'premium' | null>(null)

  if (!isOpen) return null

  function handlePremium() {
    if (isAuthenticated) {
      if (typeof window !== 'undefined' && currentUser) {
        window.localStorage.setItem(
          CHATBOT_SESSION_STORAGE_KEY,
          JSON.stringify({
            planType: 'premium',
            isPaid: false,
            isAuthenticated: true,
            user: currentUser,
          })
        )
      }
      dispatch(resetChat())
      dispatch(setPlanType('premium'))
      dispatch(setStage('questioning'))
      dispatch(setIsPaid(false))
      dispatch(closeModal())
      router.push('/chatbot')
      return
    }

    setLoadingPlan('premium')
    setTimeout(() => {
      const premiumUser = {
        id: 'google-user-001',
        email: 'user@gmail.com',
        name: 'Alex Johnson',
        plan: 'gold' as const,
      }

      dispatch(resetChat())
      dispatch(setPlanType('premium'))
      dispatch(setStage('questioning'))
      dispatch(setIsPaid(false))
      dispatch(loginSuccess(premiumUser))
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          CHATBOT_SESSION_STORAGE_KEY,
          JSON.stringify({
            planType: 'premium',
            isPaid: false,
            isAuthenticated: true,
            user: premiumUser,
          })
        )
      }
      dispatch(closeModal())
      setLoadingPlan(null)
      router.push('/chatbot')
    }, 1800)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={() => dispatch(closeModal())}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-orange-400" />

          {/* Close */}
          <button
            onClick={() => dispatch(closeModal())}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="px-6 pb-8 pt-8">
            {/* Header */}
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Choose your plan</p>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Start your weight-loss journey
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Unlock premium for your full personalized plan.
            </p>

            {/* Premium card */}
            <div className="mt-6 grid gap-4 sm:grid-cols-1">

              {/* ── PREMIUM ── */}
              <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-primary bg-background p-5 shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20">
                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />

                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">Premium</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Zap className="h-3 w-3" /> Best value
                  </span>
                </div>
                <p className="mt-1 text-3xl font-extrabold text-foreground">
                  {PRICE}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">One-time · Instant access</p>

                <ul className="mt-4 flex-1 space-y-2">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handlePremium}
                  disabled={loadingPlan === 'premium'}
                  className="relative mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
                >
                  {loadingPlan === 'premium' ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in with Google...
                    </>
                  ) : (
                    <>
                      {/* Google icon */}
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Get Premium Plan – {PRICE}
                    </>
                  )}
                </button>

                {/* Trust badge */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground/60" />
                  <p className="text-center text-[10px] text-muted-foreground/60">
                    Secure payment via Stripe
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground/70">
              10,000+ people already transformed their bodies with FitlyAi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
