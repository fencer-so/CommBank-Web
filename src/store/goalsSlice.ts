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
    // Load all existing goals in one Redux action
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      const map: IdToGoal = {}
      const list: string[] = []

      action.payload.forEach((goal) => {
        if (!Object.prototype.hasOwnProperty.call(map, goal.id)) {
          list.push(goal.id)
        }

        map[goal.id] = goal
      })

      state.map = map
      state.list = list
    },

    createGoal: (state, action: PayloadAction<Goal>) => {
      const goal = action.payload

      if (!Object.prototype.hasOwnProperty.call(state.map, goal.id)) {
        state.list.push(goal.id)
      }

      state.map[goal.id] = goal
    },

    updateGoal: (state, action: PayloadAction<Goal>) => {
      state.map[action.payload.id] = action.payload
    },
  },
})

export const { setGoals, createGoal, updateGoal } = goalsSlice.actions

export const selectGoalsMap = (state: RootState) => state.goals.map
export const selectGoalsList = (state: RootState) => state.goals.list

export default goalsSlice.reducer

