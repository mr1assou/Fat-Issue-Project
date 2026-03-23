'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { cn } from '@/lib/utils'

export function QuestionnaireProgress() {
  const { currentStep, totalSteps } = useAppSelector((state) => state.questionnaire)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="mt-4 flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              step < currentStep && 'bg-accent text-accent-foreground',
              step === currentStep && 'bg-primary text-primary-foreground',
              step > currentStep && 'bg-secondary text-muted-foreground'
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
