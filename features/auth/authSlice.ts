import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type PlanType = 'silver' | 'gold' | null

export interface User {
  id: string
  email: string
  name: string
  plan: PlanType
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    updatePlan: (state, action: PayloadAction<PlanType>) => {
      if (state.user) {
        state.user.plan = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { 
  setLoading, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updatePlan,
  clearError 
} = authSlice.actions

export default authSlice.reducer
