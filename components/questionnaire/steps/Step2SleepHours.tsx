'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setAnswer } from '@/features/questionnaire/questionnaireSlice'
import { QuestionCard } from '../QuestionCard'
import { OptionButton } from '../OptionButton'
import { Clock } from 'lucide-react'

const options = [
  { value: 'less-than-5', label: 'Less than 5 hours', description: 'Significantly below recommended' },
  { value: '5-6', label: '5-6 hours', description: 'Below recommended' },
  { value: '6-7', label: '6-7 hours', description: 'Slightly below recommended' },
  { value: '7-8', label: '7-8 hours', description: 'Within recommended range' },
  { value: 'more-than-8', label: 'More than 8 hours', description: 'Above recommended' },
]

export function Step2SleepHours() {
  const dispatch = useAppDispatch()
  const { answers } = useAppSelector((state) => state.questionnaire)

  const handleSelect = (value: string) => {
    dispatch(setAnswer({ key: 'sleepHours', value }))
  }

  return (
    <QuestionCard
      title="How many hours do you typically sleep per night?"
      description="Consider your average sleep duration on a typical night."
    >
      <div className="grid gap-3">
        {options.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            description={option.description}
            icon={<Clock className="h-6 w-6" />}
            selected={answers.sleepHours === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </QuestionCard>
  )
}
