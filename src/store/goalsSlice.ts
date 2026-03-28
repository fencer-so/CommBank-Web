import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Goal } from '../api/types'
import { RootState } from './store'

export interface GoalsState {
  map: IdToGoal
  list: string[]
}

export interface IdToGoal {
  [id: string]: Goal
}

const initialState: GoalsState = {
  map: {},
  list: [],
}

export const goalsSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    createGoal: (state, action: PayloadAction<Goal>) => {
      state.map[action.payload.id] = action.payload
      state.list.push(action.payload.id)
    },

    updateGoal: (state, action: PayloadAction<Goal>) => {
      state.map[action.payload.id] = action.payload
    },

    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.map = {}
      state.list = []

      action.payload.forEach((goal) => {
        state.map[goal.id] = goal
        state.list.push(goal.id)
      })
    },
  },
})

export const { createGoal, updateGoal, setGoals } = goalsSlice.actions

export const selectGoalsMap = (state: RootState) => state.goals.map
export const selectGoalsList = (state: RootState) => state.goals.list

export default goalsSlice.reducer
