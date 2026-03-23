'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setAnswer } from '@/features/questionnaire/questionnaireSlice'
import { QuestionCard } from '../QuestionCard'
import { OptionButton } from '../OptionButton'
import { Smartphone, Dumbbell, ThermometerSun } from 'lucide-react'

const screenTimeOptions = [
  { value: 'none', label: 'No screen time', description: 'I avoid screens before bed' },
  { value: '30-min', label: 'Less than 30 minutes', description: 'Minimal screen exposure' },
  { value: '1-hour', label: '30 min - 1 hour', description: 'Moderate screen time' },
  { value: 'more-than-1-hour', label: 'More than 1 hour', description: 'Extended screen time' },
]

const exerciseOptions = [
  { value: 'rarely', label: 'Rarely', description: 'Less than once a week' },
  { value: '1-2-times', label: '1-2 times per week', description: 'Light activity' },
  { value: '3-4-times', label: '3-4 times per week', description: 'Moderate activity' },
  { value: 'daily', label: 'Daily', description: 'Regular exercise routine' },
]

const stressOptions = [
  { value: 'low', label: 'Low', description: 'I feel generally calm' },
  { value: 'moderate', label: 'Moderate', description: 'Some stress but manageable' },
  { value: 'high', label: 'High', description: 'Frequently stressed' },
  { value: 'very-high', label: 'Very High', description: 'Constantly stressed' },
]

export function Step4Lifestyle() {
  const dispatch = useAppDispatch()
  const { answers } = useAppSelector((state) => state.questionnaire)

  return (
    <QuestionCard
      title="Tell us about your lifestyle"
      description="These factors can significantly impact your sleep quality."
    >
      <div className="space-y-8">
        {/* Screen Time */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-accent" />
            <h3 className="font-medium text-foreground">Screen time before bed</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {screenTimeOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                description={option.description}
                selected={answers.screenTime === option.value}
                onClick={() => dispatch(setAnswer({ key: 'screenTime', value: option.value }))}
              />
            ))}
          </div>
        </div>

        {/* Exercise */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-accent" />
            <h3 className="font-medium text-foreground">Exercise frequency</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {exerciseOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                description={option.description}
                selected={answers.exerciseFrequency === option.value}
                onClick={() => dispatch(setAnswer({ key: 'exerciseFrequency', value: option.value }))}
              />
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <ThermometerSun className="h-5 w-5 text-accent" />
            <h3 className="font-medium text-foreground">Current stress level</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {stressOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                description={option.description}
                selected={answers.stressLevel === option.value}
                onClick={() => dispatch(setAnswer({ key: 'stressLevel', value: option.value }))}
              />
            ))}
          </div>
        </div>
      </div>
    </QuestionCard>
  )
}
