import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import budgetDateReducer from "./budget/budgetPageDateSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({user: userReducer, budgetDate: budgetDateReducer});

const persistConfig = {
  key : 'root',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: {
    persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export const persistor = persistStore(reduxStore);
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
