'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface QuestionCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function QuestionCard({ title, description, children }: QuestionCardProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="mt-2 text-base text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
