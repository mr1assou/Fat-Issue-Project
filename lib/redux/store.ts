import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import questionnaireReducer from '@/features/questionnaire/questionnaireSlice'
import chatbotReducer from '@/features/chatbot/chatbotSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questionnaire: questionnaireReducer,
    chatbot: chatbotReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
