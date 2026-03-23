'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, CheckCircle2, ChevronRight, ChevronLeft, Activity, Flame } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  setUserAnswer,
  openCheckoutModal,
  setDailyCalories,
  clearUserAnswerKeys,
} from '@/features/chatbot/chatbotSlice'

const QUESTIONS = [
  {
    title: 'What is your main goal right now?',
    key: 'goal',
    options: ['Lose weight', 'Lose belly fat', 'Get healthier', 'Improve my lifestyle'],
  },
  {
    title: 'How do you currently feel about your body?',
    key: 'feel',
    options: ['I feel overweight', 'I feel low energy', 'I’m not satisfied with my shape', 'I feel unhealthy'],
  },
  {
    title: 'How active are you during the day?',
    key: 'activity',
    options: ['Mostly sitting (office / home)', 'Slightly active (some movement)', 'Active (walking / gym)', 'Very active'],
  },
  {
    title: 'Which best describes your eating habits?',
    key: 'eating',
    options: ['I eat a lot of sugar / fast food', 'I don’t have a fixed diet', 'I eat normally but see no results', 'I try to eat healthy'],
  },
]

type BasicFunnelProps = {
  /** `page` = dedicated route (centered, below header). `overlay` = absolute layer (e.g. embedded). */
  layout?: 'page' | 'overlay'
  /** Called when user closes via backdrop (e.g. navigate home). */
  onDismiss?: () => void
}

export function BasicFunnel({ layout = 'page', onDismiss }: BasicFunnelProps) {
  const dispatch = useAppDispatch()
  const { planType, isPaid } = useAppSelector((s) => s.chatbot)
  
  const [step, setStep] = useState(0)
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
    }
  }, [])

  // Only show if basic plan and not yet paid
  if (planType !== 'basic' || isPaid) return null
  if (dismissed) return null

  function clearAnalyzeTimer() {
    if (analyzeTimerRef.current) {
      clearTimeout(analyzeTimerRef.current)
      analyzeTimerRef.current = null
    }
  }

  /** Jump to a question step and drop answers from that step onward (so Redux/local stay consistent). */
  function goToStep(targetStep: number) {
    if (targetStep < 0 || targetStep >= QUESTIONS.length) return
    clearAnalyzeTimer()
    setIsAnalyzing(false)
    const cleared = { ...localAnswers }
    const keysToRemove: string[] = []
    for (let i = targetStep; i < QUESTIONS.length; i++) {
      const k = QUESTIONS[i].key
      keysToRemove.push(k)
      delete cleared[k]
    }
    if (keysToRemove.length) dispatch(clearUserAnswerKeys(keysToRemove))
    setLocalAnswers(cleared)
    setStep(targetStep)
  }

  function handleBack() {
    if (isAnalyzing || step >= QUESTIONS.length) {
      goToStep(QUESTIONS.length - 1)
      return
    }
    if (step > 0) goToStep(step - 1)
  }

  const canGoBack = isAnalyzing || step >= QUESTIONS.length || step > 0

  const funnelBackButton = canGoBack ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        handleBack()
      }}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
      Back
    </button>
  ) : null

  function handleOptionClick(key: string, value: string) {
    const newAnswers = { ...localAnswers, [key]: value }
    setLocalAnswers(newAnswers)
    dispatch(setUserAnswer({ key: key as any, value }))

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 280)
    } else {
      // Finished questions
      setStep((s) => s + 1)
      setIsAnalyzing(true)
      
      // Calculate insights
      let baseCals = 2000
      if (newAnswers.goal?.includes('weight') || newAnswers.goal?.includes('fat')) baseCals -= 300
      if (newAnswers.activity?.includes('sitting')) baseCals -= 200
      if (newAnswers.activity?.includes('Very active')) baseCals += 400
      dispatch(setDailyCalories(baseCals))

      clearAnalyzeTimer()
      analyzeTimerRef.current = setTimeout(() => {
        setIsAnalyzing(false)
        analyzeTimerRef.current = null
      }, 2000)
    }
  }

  // Single stable shell: one entrance animation when the funnel mounts — inner panels
  // swap with a light fade so steps don’t “pop” the whole modal like before.
  const goal = localAnswers['goal'] || 'Fat loss'
  const activity = localAnswers['activity'] || 'Moderate'
  const isLowActivity = activity.includes('sitting') || activity.includes('Slightly')
  const q = QUESTIONS[step]

  let inner: React.ReactNode

  if (isAnalyzing) {
    inner = (
      <div className="flex flex-col overflow-hidden rounded-2xl bg-card text-center shadow-2xl">
        {funnelBackButton && (
          <div className="flex justify-start border-b border-border/60 px-4 pb-3 pt-4 text-left sm:px-6 sm:pt-5">
            {funnelBackButton}
          </div>
        )}
        <div className="flex flex-col items-center justify-center px-6 pb-12 pt-8 sm:px-10 sm:pb-14">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-primary/20 opacity-20" />
            <Activity className="h-10 w-10 animate-pulse text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analyzing your profile...</h2>
          <p className="mt-2 text-muted-foreground">Processing your answers and designing the optimal plan.</p>
        </div>
      </div>
    )
  } else if (step >= QUESTIONS.length) {
    inner = (
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {funnelBackButton && (
          <div className="flex justify-start border-b border-border bg-card px-4 pb-3 pt-4 text-left sm:px-6 sm:pt-5">
            {funnelBackButton}
          </div>
        )}
        <div className="flex flex-col md:flex-row">
        {/* Left Side: Success Message */}
        <div className="flex w-full flex-col justify-center bg-zinc-900 px-6 py-10 text-center text-white md:w-[45%] md:p-8">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h2 className="text-2xl font-bold tracking-tight">Your Personalized<br/>Plan is Ready</h2>
          <p className="mt-4 text-sm text-zinc-300">We've crafted the perfect path to your goals based on your accurate body analytics.</p>
        </div>

        {/* Right Side: Insights and Payment */}
        <div className="w-full bg-card p-6 sm:p-8 md:w-[55%] md:p-10">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Insights</h3>

          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Flame className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-muted-foreground">Target Goal</p>
                <p className="truncate font-semibold text-foreground">{goal}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-muted-foreground">Key Observation</p>
                <p className="truncate font-semibold text-foreground">
                  {isLowActivity
                    ? 'Sedentary load detected'
                    : 'High activity fueling required'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
            <p className="text-sm font-medium text-foreground">
              Unlock your full personalized diet plan, 7-day meal plan, and downloadable PDF.
            </p>
            <button
              type="button"
              onClick={() => dispatch(openCheckoutModal())}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Unlock My Plan for $2
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Secure 1-click checkout</p>
        </div>
        </div>
      </div>
    )
  } else {
    inner = (
      <div className="overflow-hidden rounded-2xl bg-card shadow-2xl">
        {funnelBackButton && (
          <div className="flex justify-start border-b border-border/60 px-6 pb-3 pt-5 text-left sm:px-10 sm:pt-6">
            {funnelBackButton}
          </div>
        )}
        <div
          className={`px-6 pb-6 sm:px-10 sm:pb-10 ${funnelBackButton ? 'pt-2' : 'pt-6 sm:pt-8'}`}
        >
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Step {step + 1} of {QUESTIONS.length}
          </p>
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">{q.title}</h2>
        </div>

        <div className="space-y-3">
          {q.options.map((opt) => {
            const selected = localAnswers[q.key] === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionClick(q.key, opt)}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border-2 p-4 text-left transition-all hover:border-primary hover:bg-primary hover:shadow-md active:scale-[0.98] ${
                  selected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-muted/30'
                }`}
              >
                <span
                  className={`text-base font-medium transition-colors ${
                    selected
                      ? 'text-primary group-hover:text-white'
                      : 'text-muted-foreground group-hover:text-white'
                  }`}
                >
                  {opt}
                </span>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 group-hover:border-white group-hover:opacity-100 group-hover:ring-2 group-hover:ring-white/40 ${
                    selected
                      ? 'border-primary opacity-100 ring-2 ring-primary/30'
                      : 'border-transparent opacity-0'
                  }`}
                  aria-hidden
                >
                  <Check
                    className={`h-3.5 w-3.5 ${selected ? 'text-primary group-hover:text-white' : 'text-white'}`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex w-full gap-1.5" role="navigation" aria-label="Question steps">
          {QUESTIONS.map((_, i) => {
            const done = i < step
            return (
              <button
                key={i}
                type="button"
                title={done ? `Go back to question ${i + 1}` : `Question ${i + 1}`}
                disabled={!done}
                onClick={() => done && goToStep(i)}
                className={`flex min-h-11 min-w-0 flex-1 cursor-default flex-col justify-center rounded-md border-0 bg-transparent p-0 transition-opacity ${
                  done ? 'cursor-pointer hover:opacity-80' : ''
                }`}
              >
                <span
                  className={`block h-1.5 w-full rounded-full transition-colors duration-300 ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              </button>
            )
          })}
        </div>
        </div>
      </div>
    )
  }

  const phase = isAnalyzing ? 'analyzing' : step >= QUESTIONS.length ? 'results' : 'questions'
  const maxWidthClass = phase === 'results' ? 'max-w-4xl' : 'max-w-xl'
  const isOverlay = layout === 'overlay'

  function handleBackdropClose() {
    setDismissed(true)
    onDismiss?.()
  }

  const shellClass = isOverlay
    ? 'absolute inset-x-0 bottom-0 top-16 z-40 flex items-center justify-center p-4 sm:p-6'
    : 'relative z-10 flex min-h-[calc(100dvh-4rem)] w-full flex-1 items-center justify-center bg-muted/30 p-4 sm:p-6'

  const backdropClass = isOverlay
    ? 'absolute inset-0 cursor-default border-0 bg-black/40 p-0 backdrop-blur-sm'
    : 'absolute inset-0 cursor-default border-0 bg-muted/40 p-0 backdrop-blur-[2px]'

  return (
    <div className={shellClass}>
      <button
        type="button"
        aria-label="Close questionnaire"
        className={backdropClass}
        onClick={handleBackdropClose}
      />

      {/* One entrance when funnel opens; phase changes (questions → analyzing → results) get a light fade */}
      <div className={`relative z-10 w-full ${maxWidthClass} transition-[max-width] duration-500 ease-in-out`}>
        <div key={phase} className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500">
          {inner}
        </div>
      </div>
    </div>
  )
}
