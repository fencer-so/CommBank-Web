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

    createGoals: (state, action: PayloadAction<Goal[]>) => {
      action.payload.forEach((goal) => {
        state.map[goal.id] = goal
        if (!state.list.includes(goal.id)) {
          state.list.push(goal.id)
        }
      })
    },
  },
})

export const { createGoal, updateGoal, createGoals } = goalsSlice.actions

export const selectGoalsMap = (state: RootState) => state.goals.map
export const selectGoalsList = (state: RootState) => state.goals.list

export default goalsSlice.reducer
