import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Goal } from '../api/types';

export interface GoalsState {
  map: IdToGoal;
  list: string[];
}

export interface IdToGoal {
  [id: string]: Goal;
}

const initialState: GoalsState = {
  map: {},
  list: [],
};

export const goalsSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    createGoal: (state, action: PayloadAction<Goal>) => {
      const goal = action.payload;
      state.map[goal.id] = goal;
      state.list.push(goal.id);
    },
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.map = {};
      state.list = [];
      action.payload.forEach(goal => {
        state.map[goal.id] = goal;
        state.list.push(goal.id);
      });
    }
  }
});

export const { createGoal, setGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
