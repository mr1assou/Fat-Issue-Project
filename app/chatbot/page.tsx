'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  addMessage,
  openModal,
  openCheckoutModal,
  resetConversation,
  setPlanType,
  setStage,
  setIsPaid,
} from '@/features/chatbot/chatbotSlice'
import { loginSuccess } from '@/features/auth/authSlice'
import { Header } from '@/components/layout/Header'
import { CheckoutModal } from '@/components/checkout/CheckoutModal'
import { Flame, ArrowLeft, Send, RefreshCw, CheckCircle2, Zap } from 'lucide-react'

const CHATBOT_CONTEXT_STORAGE_KEY = 'chatbot-premium-context-v1'
const CHATBOT_SESSION_STORAGE_KEY = 'chatbot-session-v1'
const CHATBOT_WELCOME_MESSAGE =
  "Hey 👋 I’m your AI nutrition assistant.\nI’ll help you create a personalized plan to lose body fat and feel better in your body."

function cleanAssistantText(content: string) {
  return content
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[—–]/g, '-')
    .replace(/\*/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function FormattedAssistantContent({ content }: { content: string }) {
  const cleaned = cleanAssistantText(content)
  const lines = cleaned.split('\n')

  return (
    <div className="space-y-2">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim()
        if (!line) return <div key={`empty-${idx}`} className="h-1" />

        if (/^---+$/.test(line)) {
          return <hr key={`hr-${idx}`} className="my-2 border-border/60" />
        }

        const markdownHeading = line.match(/^#{1,6}\s+(.*)$/)
        if (markdownHeading) {
          return (
            <p key={`md-h-${idx}`} className="mt-3 text-sm font-semibold text-foreground">
              {markdownHeading[1]}
            </p>
          )
        }

        const numberedSection = line.match(/^(\d+)\.\s+(.*)$/)
        if (numberedSection) {
          return (
            <p key={`num-${idx}`} className="mt-3 text-sm font-semibold text-foreground">
              {numberedSection[1]}. {numberedSection[2]}
            </p>
          )
        }

        const bulletItem = line.match(/^[-*]\s+(.*)$/)
        if (bulletItem) {
          return (
            <div key={`bullet-${idx}`} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <p>{bulletItem[1]}</p>
            </div>
          )
        }

        return (
          <p key={`p-${idx}`} className="text-sm leading-relaxed text-foreground">
            {line}
          </p>
        )
      })}
    </div>
  )
}

function isGeneratedPlan(content: string) {
  const text = content.toUpperCase()
  const hasDays = /DAY\s*1/.test(text) && /DAY\s*7/.test(text)
  const hasCoreSections =
    (text.includes('FULL 7-DAY DIET PLAN') || text.includes('PERSONALIZED WEIGHT LOSS PLAN') || text.includes('7-DAY')) &&
    text.includes('INTRODUCTION') &&
    text.includes('USER PROFILE')

  return hasDays && hasCoreSections
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatbotPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()

  const { stage, planType, messages, isPaid } =
    useAppSelector((s) => s.chatbot)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const user            = useAppSelector((s) => s.auth.user)

  const [inputValue, setInputValue]   = useState('')
  const [isTyping, setIsTyping]       = useState(false)
  const [isSessionHydrated, setIsSessionHydrated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [googleAuthAction, setGoogleAuthAction] = useState<'signup' | 'login' | null>(null)
  const isHardReloadRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  const requiresPremiumPayment = planType === 'premium' && !isPaid

  // Prepare plan text for PDF: strip preamble, preserve markdown structure
  const normalizePlanText = (raw: string): string => {
    // 1. Trim any preamble before INTRODUCTION
    const introMatch = raw.search(/\bINTRODUCTION\b/i)
    const cleaned = introMatch > 0 ? raw.slice(introMatch) : raw

    // 2. Collapse excessive blank lines
    const normalized = cleaned.replace(/\n{3,}/g, '\n\n').trim()

    // 3. Ensure Summary: label exists for PDF dedicated page
    const hasSummaryLabel = /^Summary:/im.test(normalized)
    if (!hasSummaryLabel) {
      return normalized.replace(/^SUMMARY\s*$/im, 'Summary:')
    }
    return normalized
  }

  const downloadGeneratedPdf = useCallback(async (planText: string) => {
    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: user?.name ?? 'Guest',
        planText: normalizePlanText(planText),
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
  }, [user?.name])

  // Restore minimal session so reload keeps user on /chatbot.
  useEffect(() => {
    if (typeof window === 'undefined') return
    // If store already has runtime state (SPA navigation), don't override it.
    if (planType) {
      setIsSessionHydrated(true)
      return
    }

    const raw = window.localStorage.getItem(CHATBOT_SESSION_STORAGE_KEY)
    if (!raw) {
      setIsSessionHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(raw) as {
        planType?: 'premium' | null
        isPaid?: boolean
        isAuthenticated?: boolean
        user?: { id: string; email: string; name: string; plan: 'silver' | 'gold' | null }
      }

      if (parsed.planType === 'premium') {
        dispatch(setPlanType(parsed.planType))
        dispatch(setStage('questioning'))
      }
      if (typeof parsed.isPaid === 'boolean') {
        dispatch(setIsPaid(parsed.isPaid))
      }
      if (parsed.isAuthenticated && parsed.user) {
        dispatch(loginSuccess(parsed.user))
      }
    } catch {
      window.localStorage.removeItem(CHATBOT_SESSION_STORAGE_KEY)
    } finally {
      setIsSessionHydrated(true)
    }
  }, [dispatch, planType])

  // Persist minimal session used for page reload continuity.
  useEffect(() => {
    if (typeof window === 'undefined' || !isSessionHydrated) return

    window.localStorage.setItem(
      CHATBOT_SESSION_STORAGE_KEY,
      JSON.stringify({
        planType,
        isPaid,
        isAuthenticated,
        user,
      })
    )
  }, [planType, isPaid, isAuthenticated, user, isSessionHydrated])

  // Mark hard refresh/close so we can keep session on reload.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeUnload = () => {
      isHardReloadRef.current = true
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Leaving /chatbot via app navigation should start fresh next time.
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return
      if (isHardReloadRef.current) return

      window.localStorage.removeItem(CHATBOT_CONTEXT_STORAGE_KEY)
      dispatch(resetConversation())
    }
  }, [dispatch])

  // Guard: no planType → send home
  useEffect(() => {
    if (!isSessionHydrated) return
    if (!planType) router.replace('/')
  }, [planType, router, isSessionHydrated])

  // Premium users must authenticate before chatting.
  useEffect(() => {
    if (!isSessionHydrated) return
    if (planType === 'premium' && !isAuthenticated) setShowAuthModal(true)
    if (isAuthenticated) setShowAuthModal(false)
  }, [planType, isAuthenticated, isSessionHydrated])

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Restore saved chat context on first load.
  useEffect(() => {
    if (messages.length > 0 || typeof window === 'undefined') return

    const raw = window.localStorage.getItem(CHATBOT_CONTEXT_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as Array<{ role: 'user' | 'assistant'; content: string }>
      if (!Array.isArray(parsed)) return

      for (const item of parsed) {
        if (
          item &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string' &&
          item.content.trim().length > 0
        ) {
          dispatch(addMessage({ role: item.role, content: item.content, type: 'text' }))
        }
      }
    } catch {
      window.localStorage.removeItem(CHATBOT_CONTEXT_STORAGE_KEY)
    }
  }, [dispatch, messages.length])

  // Show first welcome message when entering chatbot.
  useEffect(() => {
    if (!isSessionHydrated) return
    if (!planType) return
    if (messages.length > 0) return

    dispatch(addMessage({ role: 'assistant', content: CHATBOT_WELCOME_MESSAGE, type: 'text' }))
  }, [dispatch, isSessionHydrated, planType, messages.length])

  // Persist chat context after each message update.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const compactHistory = messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && !!m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content }))

    window.localStorage.setItem(CHATBOT_CONTEXT_STORAGE_KEY, JSON.stringify(compactHistory))
  }, [messages])

  // ── Handle user send ────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || ['paywall', 'upgrade', 'processing'].includes(stage)) return
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    if (requiresPremiumPayment) {
      dispatch(openCheckoutModal())
      return
    }

    dispatch(addMessage({ role: 'user', content: text, type: 'text' }))
    setInputValue('')
    setIsTyping(true)

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/create-skill/chatbot-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: text }],
        }),
      })

      const data = await response.json()
      const reply =
        typeof data?.reply === 'string' && data.reply.trim()
          ? data.reply.trim()
          : "I couldn't generate a response. Please try again."

      dispatch(addMessage({ role: 'assistant', content: reply, type: 'text' }))
      if (isGeneratedPlan(reply)) {
        try {
          await downloadGeneratedPdf(reply)
          dispatch(addMessage({
            role: 'assistant',
            content: 'Your PDF has been generated and downloaded successfully.',
            type: 'text',
          }))
        } catch (error) {
          console.error('Auto PDF generation failed:', error)
          dispatch(addMessage({
            role: 'assistant',
            content: 'I generated your plan, but automatic PDF download failed. Please use the Generate PDF button in the header.',
            type: 'text',
          }))
        }
      }
    } catch {
      dispatch(addMessage({
        role: 'assistant',
        content: 'Something went wrong while contacting the AI service. Please try again.',
        type: 'text',
      }))
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, stage, requiresPremiumPayment, dispatch, messages, downloadGeneratedPdf])


  const isInputDisabled = ['paywall', 'upgrade', 'processing'].includes(stage) || !isAuthenticated

  if (!isSessionHydrated) return null
  if (!planType) return null

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <div className="flex min-h-0 flex-1">
      <aside className="hidden w-72 shrink-0 border-r border-border/40 bg-background/80 p-4 backdrop-blur md:flex md:flex-col">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {planType === 'premium' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" /> Premium
            </span>
          ) : (
            <button
              onClick={() => dispatch(openModal())}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-transparent px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              <Zap className="h-3.5 w-3.5" /> Upgrade
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">FitlyAi Coach</p>
            <p className="flex items-center gap-1 text-xs text-green-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Online · Premium mode
            </p>
          </div>
        </div>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">FitlyAi Coach</p>
                <p className="flex items-center gap-1 text-xs text-green-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online · Premium mode
                </p>
              </div>
            </div>
          </div>
          {planType === 'premium' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" /> Premium
            </span>
          ) : (
            <button
              onClick={() => dispatch(openModal())}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-transparent px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              <Zap className="h-3.5 w-3.5" /> Upgrade
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out fill-mode-both ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

              {msg.role === 'assistant' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Flame className="h-3.5 w-3.5 text-primary" />
                </div>
              )}

              <div className={`max-w-[82%] ${msg.role === 'user' ? 'order-1' : ''}`}>

                {/* ── UPGRADE wall ── */}
                {msg.type === 'upgrade' ? (
                  <div className="overflow-hidden rounded-2xl rounded-tl-sm border border-primary/20 bg-card shadow-sm">
                    <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 px-5 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Free limit reached</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-sm leading-relaxed text-foreground">{msg.content}</p>
                      <ul className="mt-3 space-y-1.5">
                        {['Full 7-day meal plan', 'Calorie & macro breakdown', 'Downloadable PDF', 'Unlimited chat'].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-xl bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-extrabold text-foreground">9$ <span className="text-sm font-semibold">one-time</span></p>
                        <p className="text-xs text-muted-foreground">One-time · Instant access</p>
                      </div>
                      <button
                        onClick={() => dispatch(openModal())}
                        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
                      >
                        <Zap className="h-4 w-4" /> Unlock Full Plan (9$)
                      </button>
                    </div>
                  </div>

                /* ── PAYWALL card ── */
                ) : msg.type === 'paywall' ? (
                  <div className="overflow-hidden rounded-2xl rounded-tl-sm border border-border bg-card shadow-sm">
                    <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 px-5 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your plan is ready</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{msg.content}</p>
                      <div className="mt-4 rounded-xl bg-primary/5 p-4 text-center">
                        <p className="text-2xl font-extrabold text-foreground">9$ <span className="text-base font-semibold">one-time</span></p>
                        <p className="mt-0.5 text-xs text-muted-foreground">One-time · Instant access</p>
                      </div>
                      <button
                        onClick={() => dispatch(openCheckoutModal())}
                        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
                      >
                        ⚡ Continue to Checkout (9$)
                      </button>
                    </div>
                  </div>

                /* ── PLAN card ── */
                ) : msg.type === 'plan' ? (
                  <div className="overflow-hidden rounded-2xl rounded-tl-sm border border-green-500/20 bg-card shadow-sm">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-5 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-green-600">✅ Your Full Plan</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto px-5 py-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{msg.content}</pre>
                    </div>
                    <div className="border-t border-border px-5 py-3">
                      <p className="text-center text-xs text-muted-foreground">Plan download is available from the header PDF button.</p>
                    </div>
                  </div>

                /* ── UPSELL card ── */
                ) : msg.type === 'upsell' ? (
                  <div className="overflow-hidden rounded-2xl rounded-tl-sm border border-orange-500/20 bg-card shadow-sm">
                    <div className="px-5 py-4">
                      <p className="text-sm leading-relaxed text-foreground">{msg.content}</p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button className="flex-1 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
                          🔄 Yes, send weekly plans
                        </button>
                        <button className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary">
                          No thanks
                        </button>
                      </div>
                    </div>
                  </div>

                /* ── Standard bubble ── */
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-tl-sm bg-secondary text-foreground'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <FormattedAssistantContent content={msg.content} />
                    ) : (
                      msg.content.replace(/\*\*(.*?)\*\*/g, '$1')
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="ml-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {user?.name?.charAt(0) ?? '?'}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out fill-mode-both">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Flame className="h-3.5 w-3.5 text-primary animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5 h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2 rounded-full bg-primary/70 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-border/40 bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (stage === 'complete') {
                      handleFollowUp()
                    } else {
                      handleSend()
                    }
                  }
                }}
                disabled={isInputDisabled}
                placeholder={
                  isInputDisabled
                    ? stage === 'processing' ? 'Generating your plan...'
                    : stage === 'upgrade'    ? 'Upgrade to continue'
                    : !isAuthenticated       ? 'Sign up or log in to start chatting'
                    : 'Complete payment to continue'
                    : stage === 'complete'   ? 'Ask a follow-up question...'
                    : 'Type your answer...'
                }
                className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary/50 focus:bg-background disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={stage === 'complete' ? handleFollowUp : handleSend}
                disabled={isInputDisabled || !inputValue.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {stage === 'processing'
                  ? <RefreshCw className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
              FitlyAi · AI-powered · For informational purposes only
            </p>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-border/50 bg-background shadow-2xl sm:max-w-[440px] animate-in zoom-in-95 duration-200">
              
              <div className="flex flex-col items-center justify-center px-8 pb-4 pt-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                  <Flame className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Get started with FitlyAi
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a new account or log in to continue your chat, unlock your premium plan, and save your progress.
                </p>
              </div>

              <div className="space-y-4 px-8 pb-10 pt-4">
                <button
                  type="button"
                  disabled={googleAuthAction !== null}
                  onClick={() => {
                    setGoogleAuthAction('signup')
                    setTimeout(() => {
                      dispatch(loginSuccess({
                        id: 'google-user-001',
                        email: 'user@gmail.com',
                        name: 'Alex Johnson',
                        plan: 'gold',
                      }))
                      setShowAuthModal(false)
                      setGoogleAuthAction(null)
                    }, 900)
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border/60 bg-white px-4 py-4 text-sm font-semibold text-black shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:hover:bg-gray-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {googleAuthAction === 'signup' ? 'Processing...' : 'Sign up with Google'}
                </button>

                <button
                  type="button"
                  disabled={googleAuthAction !== null}
                  onClick={() => {
                    setGoogleAuthAction('login')
                    setTimeout(() => {
                      dispatch(loginSuccess({
                        id: 'google-user-001',
                        email: 'user@gmail.com',
                        name: 'Alex Johnson',
                        plan: 'gold',
                      }))
                      setShowAuthModal(false)
                      setGoogleAuthAction(null)
                    }, 900)
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border/80 bg-secondary/60 px-4 py-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-secondary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {googleAuthAction === 'login' ? 'Processing...' : 'Log in with Google'}
                </button>
                
                <div className="mt-8 space-y-4 text-center">
                  
                  <p className="text-xs leading-relaxed text-muted-foreground/80">
                    By continuing, you acknowledge that you have read and agree to our <br className="hidden sm:block" />
                    <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <CheckoutModal />
      </div>
      </div>
    </div>
  )

  function handleFollowUp() {
    void handleSend()
  }
}

// Needed for JSX type annotation inside the component
type Message = ReturnType<typeof useAppSelector> extends never ? never : {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  type?: 'text' | 'plan' | 'paywall' | 'upgrade' | 'upsell'
}
