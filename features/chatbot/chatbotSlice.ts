import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ChatStage = 'idle' | 'questioning' | 'insight' | 'upgrade' | 'paywall' | 'processing' | 'complete'
export type PlanType = 'basic' | 'premium' | null

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  type?: 'text' | 'plan' | 'paywall' | 'upgrade' | 'upsell' | 'pdf' | 'review-prompt'
}

export interface UserAnswers {
  weight?: string
  goal?: string
  activity?: string
  dietPreferences?: string
  allergies?: string
}

interface ChatbotState {
  stage: ChatStage
  planType: PlanType
  messages: Message[]
  userAnswers: Record<string, string> // Changed type
  isPaid: boolean
  isModalOpen: boolean
  isCheckoutModalOpen: boolean // Added
  questionStep: number
  dailyCalories: number | null
}

const initialState: ChatbotState = {
  stage: 'idle',
  planType: null,
  messages: [],
  userAnswers: {},
  isPaid: false,
  isModalOpen: false,
  isCheckoutModalOpen: false, // Added
  questionStep: 0,
  dailyCalories: null,
}

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
    },
    setPlanType: (state, action: PayloadAction<PlanType>) => {
      state.planType = action.payload
    },
    setStage: (state, action: PayloadAction<ChatStage>) => {
      state.stage = action.payload
    },
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      state.messages.push({
        ...action.payload,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      })
    },
    setUserAnswer: (state, action: PayloadAction<{ key: keyof UserAnswers; value: string }>) => {
      state.userAnswers[action.payload.key] = action.payload.value
    },
    /** Remove stored answers (e.g. funnel “back” clears forward steps). */
    clearUserAnswerKeys: (state, action: PayloadAction<string[]>) => {
      for (const k of action.payload) {
        delete state.userAnswers[k]
      }
    },
    nextQuestion: (state) => {
      state.questionStep += 1
    },
    setDailyCalories: (state, action: PayloadAction<number>) => {
      state.dailyCalories = action.payload
    },
    setIsPaid: (state, action: PayloadAction<boolean>) => {
      state.isPaid = action.payload
    },
    resetConversation: (state) => { // Added
      // Keep selected plan type, but clear conversation content/state.
      state.messages = []
      state.userAnswers = {}
      state.isPaid = false
      state.questionStep = 0
      state.dailyCalories = null
      state.stage = 'questioning'
      state.isCheckoutModalOpen = false
    },
    openCheckoutModal: (state) => { // Added
      state.isCheckoutModalOpen = true
    },
    closeCheckoutModal: (state) => { // Added
      state.isCheckoutModalOpen = false
    },
    resetChat: () => initialState,
  },
})

export const {
  openModal,
  closeModal,
  setPlanType,
  setStage,
  addMessage,
  setUserAnswer,
  clearUserAnswerKeys,
  nextQuestion,
  setDailyCalories,
  setIsPaid,
  resetConversation, // Added
  openCheckoutModal, // Added
  closeCheckoutModal, // Added
  resetChat,
} = chatbotSlice.actions

export default chatbotSlice.reducer
