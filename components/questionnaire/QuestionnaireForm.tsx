'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { nextStep, prevStep, completeQuestionnaire } from '@/features/questionnaire/questionnaireSlice'
import { Button } from '@/components/ui/button'
import { QuestionnaireProgress } from './QuestionnaireProgress'
import { Step1SleepQuality } from './steps/Step1SleepQuality'
import { Step2SleepHours } from './steps/Step2SleepHours'
import { Step3SleepIssues } from './steps/Step3SleepIssues'
import { Step4Lifestyle } from './steps/Step4Lifestyle'
import { Step5Goals } from './steps/Step5Goals'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const stepComponents = [
  Step1SleepQuality,
  Step2SleepHours,
  Step3SleepIssues,
  Step4Lifestyle,
  Step5Goals,
]

export function QuestionnaireForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentStep, totalSteps, answers } = useAppSelector((state) => state.questionnaire)

  const CurrentStepComponent = stepComponents[currentStep - 1]

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!answers.sleepQuality
      case 2:
        return !!answers.sleepHours
      case 3:
        return (answers.sleepIssues?.length ?? 0) > 0
      case 4:
        return !!answers.screenTime && !!answers.exerciseFrequency && !!answers.stressLevel
      case 5:
        return (answers.goals?.length ?? 0) > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === totalSteps) {
      dispatch(completeQuestionnaire())
      router.push('/pricing')
    } else {
      dispatch(nextStep())
    }
  }

  const handleBack = () => {
    dispatch(prevStep())
  }

  return (
    <div className="mx-auto max-w-2xl">
      <QuestionnaireProgress />
      
      <div className="mt-8">
        <CurrentStepComponent />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gap-2"
        >
          {currentStep === totalSteps ? (
            <>
              Complete
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
