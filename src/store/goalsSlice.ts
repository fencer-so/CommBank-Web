import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

// Define Goal type directly here
export interface Goal {
  id: string
  name: string
  targetDate: Date
  targetAmount: number
  balance: number
  created: Date
  accountId: string
  transactionIds: string[]
  tagIds: string[]
  icon?: string
}

interface GoalsState {
  goalsMap: Record<string, Goal>
}

const initialState: GoalsState = {
  goalsMap: {},
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals(state, action: PayloadAction<Goal[]>) {
      state.goalsMap = action.payload.reduce((map, goal) => {
        map[goal.id] = goal
        return map
      }, {} as Record<string, Goal>)
    },
    addGoal(state, action: PayloadAction<Goal>) {
      state.goalsMap[action.payload.id] = action.payload
    },
    updateGoal(state, action: PayloadAction<Goal>) {
      const goal = action.payload
      if (state.goalsMap[goal.id]) {
        state.goalsMap[goal.id] = goal
      }
    },
    removeGoal(state, action: PayloadAction<string>) {
      delete state.goalsMap[action.payload]
    },
  },
})

export const { setGoals, addGoal, updateGoal, removeGoal } = goalsSlice.actions

// Selectors
export const selectGoalsMap = (state: RootState) => state.goals.goalsMap
export const selectGoalsArray = (state: RootState) =>
  Object.values(state.goals.goalsMap)

export default goalsSlice.reducer