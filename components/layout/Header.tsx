'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Flame, MessageCircle, ChevronDown } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { resetChat, setIsPaid, setPlanType, setStage } from '@/features/chatbot/chatbotSlice'
import { logout } from '@/features/auth/authSlice'
import { useState } from 'react'

// Static demo user name as requested
const DEMO_NAME = 'Marwane Assou'

export function Header() {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const pathname      = usePathname()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const planType        = useAppSelector((s) => s.chatbot.planType)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const isOnChatbot = pathname === '/chatbot'

  function handleChatWithAI() {
    if (planType !== 'premium') {
      dispatch(setPlanType('premium'))
      dispatch(setStage('questioning'))
      dispatch(setIsPaid(false))
    }
    router.push('/chatbot')
  }

  function handleLogout() {
    dispatch(logout())
    dispatch(resetChat())
    setDropdownOpen(false)
    router.push('/')
  }

  async function handleGeneratePdf() {
    try {
      setIsGeneratingPdf(true)
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'FitlyAi-PersonalizedPlan.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
              FitlyAi
            </span>
          </Link>

          {/* Right side */}
          {isAuthenticated ? (
            /* ── Authenticated state ── */
            <div className="flex items-center gap-3">
              {/* Chat with AI — hidden on the chatbot page itself */}
              {!isOnChatbot && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleChatWithAI}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with AI
                </Button>
              )}

              {/* Avatar + name dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 py-1.5 pl-2 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {/* Avatar circle with initials */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {DEMO_NAME.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <span className="hidden sm:inline">{DEMO_NAME.split(' ')[0]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">{DEMO_NAME}</p>
                      <p className="text-xs text-muted-foreground">Premium · Active</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Guest state ── */
            <div className="flex items-center gap-2">
              <Button className="cursor-pointer" variant="outline" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
              </Button>
              <Button className="cursor-pointer" onClick={handleChatWithAI}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
