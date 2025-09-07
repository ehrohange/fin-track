import type { BudgetDateState } from "@/lib/types-index";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: BudgetDateState = {
  currentSelectedDate: null,
  loading: false,
  error: null,
};

const budgetDateSlice = createSlice({
  name: "budgetDate",
  initialState,
  reducers: {
    budgetDateSelectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    budgetDateSelectSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.currentSelectedDate = action.payload;
      state.error = null;
    },
    budgetDateSelectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  budgetDateSelectStart,
  budgetDateSelectSuccess,
  budgetDateSelectFailure,
} = budgetDateSlice.actions;
export default budgetDateSlice.reducer;
