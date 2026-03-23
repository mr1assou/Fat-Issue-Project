'use client'

import React from "react"

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface OptionButtonProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
}

export function OptionButton({ label, description, selected, onClick, icon }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200',
        selected
          ? 'border-accent bg-accent/10'
          : 'border-border bg-background hover:border-accent/50 hover:bg-secondary/50'
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors',
            selected ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        <span
          className={cn(
            'text-base font-medium transition-colors',
            selected ? 'text-foreground' : 'text-foreground'
          )}
        >
          {label}
        </span>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          selected
            ? 'border-accent bg-accent text-accent-foreground'
            : 'border-border bg-background'
        )}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>
    </button>
  )
}
