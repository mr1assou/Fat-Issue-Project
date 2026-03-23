'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setAnswer } from '@/features/questionnaire/questionnaireSlice'
import { QuestionCard } from '../QuestionCard'
import { OptionButton } from '../OptionButton'
import { Frown, Meh, Smile, Laugh } from 'lucide-react'

const options = [
  { value: 'poor', label: 'Poor', description: 'I rarely feel rested', icon: <Frown className="h-6 w-6" /> },
  { value: 'fair', label: 'Fair', description: 'I sometimes feel rested', icon: <Meh className="h-6 w-6" /> },
  { value: 'good', label: 'Good', description: 'I usually feel rested', icon: <Smile className="h-6 w-6" /> },
  { value: 'excellent', label: 'Excellent', description: 'I almost always feel rested', icon: <Laugh className="h-6 w-6" /> },
]

export function Step1SleepQuality() {
  const dispatch = useAppDispatch()
  const { answers } = useAppSelector((state) => state.questionnaire)

  const handleSelect = (value: string) => {
    dispatch(setAnswer({ key: 'sleepQuality', value }))
  }

  return (
    <QuestionCard
      title="How would you rate your current sleep quality?"
      description="Think about how you've been sleeping over the past month."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={answers.sleepQuality === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </QuestionCard>
  )
}
