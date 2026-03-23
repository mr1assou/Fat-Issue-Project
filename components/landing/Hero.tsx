'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAppDispatch } from '@/lib/redux/hooks'
import { openModal } from '@/features/chatbot/chatbotSlice'

export function Hero() {
  const dispatch = useAppDispatch()

  return (
    <section className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Personalized fat-loss plans</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="text-balance">Weight Loss,</span>
              <br />
              <span className="text-primary">Better Life</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Discover your unique profile and get a personalized plan to reduce stubborn belly fat, boost your energy, and feel more confident every day. Join thousands who transformed their bodies.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="w-full gap-2 sm:w-auto"
                onClick={() => dispatch(openModal())}
              >
                Chat with AI for a Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => dispatch(openModal())}>
                Get Started – 9$
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-border pt-8 sm:flex-row sm:gap-8 lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-muted-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">10,000+ fat-loss success stories</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="grid grid-cols-2 gap-4">
              {/* Before */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/fat.png"
                    alt="Person dealing with stubborn belly fat"
                    width={300}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -left-2 rounded-lg bg-background px-3 py-1.5 shadow-md">
                  <span className="text-sm font-medium text-muted-foreground">Before</span>
                </div>
              </div>

              {/* After */}
              <div className="relative mt-8">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/healthy.png"
                    alt="Person after reducing stubborn belly fat"
                    width={300}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-lg bg-primary px-3 py-1.5 shadow-md">
                  <span className="text-sm font-medium text-primary-foreground">After</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
