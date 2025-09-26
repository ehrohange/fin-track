import type { MonthlyBudgetInterface } from "@/lib/types-index";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MonthlyBudgetState {
  budget: MonthlyBudgetInterface | null;
  loading: boolean;
  error: string | null;
}

const initialState: MonthlyBudgetState = {
  budget: null,
  loading: false,
  error: null,
};

const monthlyBudgetSlice = createSlice({
  name: "monthlyBudget",
  initialState,
  reducers: {
    setMonthlyBudget: (state, action: PayloadAction<MonthlyBudgetInterface>) => {
      state.budget = action.payload;
    },
    deleteMonthlyBudget: (state) => {
      state.budget = null;
    },
    updateMonthlyBudget: (state, action: PayloadAction<MonthlyBudgetInterface>) => {
      if (state.budget) {
        state.budget = { ...state.budget, ...action.payload };
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
  setMonthlyBudget,
  deleteMonthlyBudget,
  updateMonthlyBudget,
  setLoading,
  setError,
} = monthlyBudgetSlice.actions;

export default monthlyBudgetSlice.reducer;
