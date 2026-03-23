'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setAnswer } from '@/features/questionnaire/questionnaireSlice'
import { QuestionCard } from '../QuestionCard'
import { cn } from '@/lib/utils'
import { Check, AlertCircle, Clock, Brain, Moon, Zap, Coffee, Volume2 } from 'lucide-react'

const issues = [
  { value: 'falling-asleep', label: 'Difficulty falling asleep', icon: Clock },
  { value: 'staying-asleep', label: 'Waking up during the night', icon: Moon },
  { value: 'waking-early', label: 'Waking up too early', icon: AlertCircle },
  { value: 'racing-thoughts', label: 'Racing thoughts at bedtime', icon: Brain },
  { value: 'low-energy', label: 'Low energy during the day', icon: Zap },
  { value: 'caffeine-dependency', label: 'Relying on caffeine', icon: Coffee },
  { value: 'noise-sensitivity', label: 'Noise or light sensitivity', icon: Volume2 },
  { value: 'none', label: 'None of these', icon: Check },
]

export function Step3SleepIssues() {
  const dispatch = useAppDispatch()
  const { answers } = useAppSelector((state) => state.questionnaire)
  const selectedIssues = answers.sleepIssues || []

  const handleToggle = (value: string) => {
    let newIssues: string[]
    
    if (value === 'none') {
      newIssues = selectedIssues.includes('none') ? [] : ['none']
    } else {
      if (selectedIssues.includes(value)) {
        newIssues = selectedIssues.filter((i) => i !== value)
      } else {
        newIssues = [...selectedIssues.filter((i) => i !== 'none'), value]
      }
    }
    
    dispatch(setAnswer({ key: 'sleepIssues', value: newIssues }))
  }

  return (
    <QuestionCard
      title="What sleep issues do you experience?"
      description="Select all that apply to you."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {issues.map((issue) => {
          const isSelected = selectedIssues.includes(issue.value)
          const Icon = issue.icon
          
          return (
            <button
              key={issue.value}
              type="button"
              onClick={() => handleToggle(issue.value)}
              className={cn(
                'group flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-background hover:border-accent/50 hover:bg-secondary/50'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isSelected ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  'flex-1 text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-foreground'
                )}
              >
                {issue.label}
              </span>
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all',
                  isSelected
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-background'
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
            </button>
          )
        })}
      </div>
    </QuestionCard>
  )
}
