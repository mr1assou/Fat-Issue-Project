'use client'

import Image from 'next/image'
import { useAppSelector } from '@/lib/redux/hooks'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CommunityLocked } from '@/components/community/CommunityLocked'
import { CommunityFeed } from '@/components/community/CommunityFeed'
import { Users, Calendar, Award } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Active Members', value: '1,247' },
  { icon: Calendar, label: 'Posts This Week', value: '156' },
  { icon: Award, label: 'Success Stories', value: '432' },
]

export default function CommunityPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const hasAccess = isAuthenticated && user?.plan === 'gold'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  DreamWell Community
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Connect with fellow sleep enthusiasts, share your journey, and get support from our community of members all working towards better sleep.
                </p>

                {hasAccess && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center rounded-xl bg-background p-4"
                      >
                        <stat.icon className="h-6 w-6 text-primary" />
                        <span className="mt-2 text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Community Images */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src="/images/community-chat.png"
                      alt="Online sleep community chat and support"
                      width={300}
                      height={200}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg mt-6">
                    <Image
                      src="/images/video-call-support.png"
                      alt="Video call support for sleep community"
                      width={300}
                      height={200}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          {hasAccess ? <CommunityFeed /> : <CommunityLocked />}
        </section>
      </main>
      <Footer />
    </div>
  )
}
