import type { TransactionDateState } from "@/lib/types-index";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: TransactionDateState = {
  currentSelectedDate: null,
  loading: false,
  error: null,
};

const transactionDateSlice = createSlice({
  name: "transactionDate",
  initialState,
  reducers: {
    transactionDateSelectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    transactionDateSelectSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.currentSelectedDate = action.payload;
      state.error = null;
    },
    transactionDateSelectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  transactionDateSelectStart,
  transactionDateSelectSuccess,
  transactionDateSelectFailure,
} = transactionDateSlice.actions;
export default transactionDateSlice.reducer;
