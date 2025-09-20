import type { Transaction } from "@/lib/types-index";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload); // latest first
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t._id !== action.payload);
    },
    setTransactionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTransactionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  deleteTransaction,
  setTransactionsLoading,
  setTransactionsError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
