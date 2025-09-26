import type { Category } from "@/lib/types-index";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.unshift(action.payload); // latest first
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c._id !== action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
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
  setCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  setLoading,
  setError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
