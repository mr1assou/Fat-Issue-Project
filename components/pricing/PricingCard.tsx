'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingPlan {
  name: string
  description: string
  price: number
  priceLabel: string
  features: PricingFeature[]
  popular?: boolean
  ctaText: string
  ctaHref: string
}

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col border-2 transition-all duration-300',
        plan.popular
          ? 'border-accent shadow-lg shadow-accent/10'
          : 'border-border hover:border-accent/30'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="font-serif text-2xl font-semibold text-foreground">
          {plan.name}
        </CardTitle>
        <CardDescription className="mt-2 text-muted-foreground">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* Price */}
        <div className="mb-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-foreground">${plan.price}</span>
            <span className="text-muted-foreground">{plan.priceLabel}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-3">
              {feature.included ? (
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-3 w-3 text-accent" />
                </div>
              ) : (
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                  <X className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span
                className={cn(
                  'text-sm',
                  feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          className="w-full"
          variant={plan.popular ? 'default' : 'outline'}
          size="lg"
          asChild
        >
          <Link href={plan.ctaHref}>{plan.ctaText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
