'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setAnswer } from '@/features/questionnaire/questionnaireSlice'
import { QuestionCard } from '../QuestionCard'
import { cn } from '@/lib/utils'
import { Check, Zap, Clock, Brain, Heart, Moon, Sun } from 'lucide-react'

const goals = [
  { value: 'more-energy', label: 'Have more energy during the day', icon: Zap },
  { value: 'fall-asleep-faster', label: 'Fall asleep faster', icon: Moon },
  { value: 'sleep-through-night', label: 'Sleep through the night', icon: Clock },
  { value: 'wake-refreshed', label: 'Wake up feeling refreshed', icon: Sun },
  { value: 'reduce-stress', label: 'Reduce stress and anxiety', icon: Brain },
  { value: 'improve-health', label: 'Improve overall health', icon: Heart },
]

export function Step5Goals() {
  const dispatch = useAppDispatch()
  const { answers } = useAppSelector((state) => state.questionnaire)
  const selectedGoals = answers.goals || []

  const handleToggle = (value: string) => {
    let newGoals: string[]
    
    if (selectedGoals.includes(value)) {
      newGoals = selectedGoals.filter((g) => g !== value)
    } else {
      newGoals = [...selectedGoals, value]
    }
    
    dispatch(setAnswer({ key: 'goals', value: newGoals }))
  }

  return (
    <QuestionCard
      title="What are your sleep goals?"
      description="Select all the outcomes you'd like to achieve. We'll personalize your plan accordingly."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => {
          const isSelected = selectedGoals.includes(goal.value)
          const Icon = goal.icon
          
          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => handleToggle(goal.value)}
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
                {goal.label}
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
