import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "After years of struggling with insomnia, DreamWell's personalized approach finally helped me understand my sleep patterns. I'm now sleeping 7+ hours consistently.",
    author: 'Sarah M.',
    role: 'Marketing Manager',
    plan: 'Gold Member',
  },
  {
    quote: "The community aspect is incredible. Having others to share experiences with makes the journey so much easier. Plus, the eBook is packed with actionable advice.",
    author: 'James L.',
    role: 'Software Engineer',
    plan: 'Gold Member',
  },
  {
    quote: "I was skeptical at first, but the sleep assessment was spot-on. The recommendations were practical and I saw improvements within the first week.",
    author: 'Emily R.',
    role: 'Teacher',
    plan: 'Silver Member',
  },
]

export function Testimonials() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            What Our Members Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands who have transformed their sleep with DreamWell.
          </p>
        </div>

        {/* Testimonials with Images */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/happy_man.png"
                alt="Support group discussing sleep challenges"
                width={600}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-lg bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground">Community Support</p>
              <p className="text-xs text-muted-foreground">Share experiences, get support</p>
            </div>
          </div>

          {/* Right: Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.author}
                className="border-border bg-card backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-muted-foreground/40" />
                  <p className="mt-3 text-foreground leading-relaxed">
                    {`"${testimonial.quote}"`}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} - {testimonial.plan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
