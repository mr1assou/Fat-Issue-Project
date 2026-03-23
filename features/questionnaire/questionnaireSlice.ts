import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface QuestionnaireAnswers {
  sleepQuality: string
  sleepHours: string
  sleepIssues: string[]
  wakeUpFeeling: string
  screenTime: string
  caffeineIntake: string
  exerciseFrequency: string
  stressLevel: string
  sleepEnvironment: string
  goals: string[]
}

interface QuestionnaireState {
  currentStep: number
  totalSteps: number
  answers: Partial<QuestionnaireAnswers>
  isComplete: boolean
}

const initialState: QuestionnaireState = {
  currentStep: 1,
  totalSteps: 5,
  answers: {},
  isComplete: false,
}

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1 && action.payload <= state.totalSteps) {
        state.currentStep = action.payload
      }
    },
    setAnswer: <K extends keyof QuestionnaireAnswers>(
      state: QuestionnaireState,
      action: PayloadAction<{ key: K; value: QuestionnaireAnswers[K] }>
    ) => {
      state.answers[action.payload.key] = action.payload.value
    },
    completeQuestionnaire: (state) => {
      state.isComplete = true
    },
    resetQuestionnaire: () => initialState,
  },
})

export const { 
  nextStep, 
  prevStep, 
  goToStep, 
  setAnswer, 
  completeQuestionnaire,
  resetQuestionnaire 
} = questionnaireSlice.actions

export default questionnaireSlice.reducer
