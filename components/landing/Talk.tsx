import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Talk() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/chat_community.png"
                alt="Community members discussing sleep challenges and sharing ideas"
                width={450}
                height={400}
                className="h-auto w-full max-h-[400px] sm:max-h-[450px] lg:max-h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Connect with Others Who Understand
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join a supportive community where people who have faced sleep issues can communicate with each other, share their experiences, and exchange ideas. You're not alone in your journey to better sleep.
            </p>
            <ul className="mt-6 space-y-3 text-left">
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Connect with others facing similar sleep challenges</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Share your ideas and learn from community experiences</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Get support and encouragement from a caring community</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
                <Link href="/community">
                  Join the Community
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

