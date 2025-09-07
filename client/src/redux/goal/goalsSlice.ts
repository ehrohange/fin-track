import type { Goal } from "@/lib/types-index";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.goals = action.payload;
    },
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.unshift(action.payload); // latest first
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((g) => g._id !== action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex((g) => g._id === action.payload._id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGoals,
  addGoal,
  deleteGoal,
  updateGoal,
  setLoading,
  setError,
} = goalsSlice.actions;

export default goalsSlice.reducer;
