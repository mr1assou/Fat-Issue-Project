import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Crown, Users, MessageCircle, Video } from 'lucide-react'

const features = [
  { icon: Users, text: 'Connect with 1,000+ sleep enthusiasts' },
  { icon: MessageCircle, text: 'Share tips and get support' },
  { icon: Video, text: 'Join live Q&A sessions with experts' },
]

export function CommunityLocked() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Lock className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
        Community Access Required
      </h2>

      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        The DreamWell community is exclusively available for Gold members. Upgrade to unlock full access and connect with others on their sleep journey.
      </p>

      <Card className="mx-auto mt-8 max-w-sm border-accent/30 bg-accent/5">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-accent" />
            <span className="font-semibold text-foreground">Gold Member Benefits</span>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <feature.icon className="h-4 w-4 text-accent" />
                {feature.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/pricing">Upgrade to Gold</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
