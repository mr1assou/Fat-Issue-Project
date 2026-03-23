import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "After years of struggling with stubborn belly fat, FitlyAi's personalized plan finally helped me understand what was holding me back. I feel lighter and more confident than I have in years.",
    author: 'Sarah M.',
    role: 'Marketing Manager',
    plan: 'Gold Member',
  },
  {
    quote: "The AI guidance plus the community support is incredible. Sharing progress with people who get it made the whole fat-loss journey easier. The habit suggestions worked fast for me.",
    author: 'James L.',
    role: 'Software Engineer',
    plan: 'Gold Member',
  },
  {
    quote: "I was skeptical at first, but the plan recommendations were on point. I started seeing changes in my routine within the first week, and my belly feels noticeably better over time.",
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
            What Our Members Say About Fat Loss
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands who have transformed stubborn belly fat with FitlyAi.
          </p>
        </div>

        {/* Testimonials (horizontal) */}
        <div className="mt-16 flex gap-6 overflow-x-auto pb-2 lg:overflow-x-visible lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author}
              className="min-w-[320px] flex-shrink-0 border-border bg-card backdrop-blur-sm lg:min-w-0 lg:flex-1"
            >
              <CardContent className="p-6">
                <Quote className="h-6 w-6 text-muted-foreground/40" />
                <p className="mt-3 text-foreground leading-relaxed">
                  {`"${testimonial.quote}"`}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} - {testimonial.plan}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
