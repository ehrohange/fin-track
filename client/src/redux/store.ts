// src/store/index.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/userSlice";
import transactionDateReducer from "./transaction/transactionPageDateSlice";
import goalsReducer from "./goal/goalsSlice";
import transactionsReducer from "./transaction/transactionsSlice";
import categoriesReducer from "./categories/categoriesSlice";
import { resetState } from "./resetActions";

const appReducer = combineReducers({
  user: userReducer,
  transactionDate: transactionDateReducer,
  categories: categoriesReducer,
  goals: goalsReducer,
  transactions: transactionsReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    state = undefined; // ✅ wipes everything on logout
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(reduxStore);

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
