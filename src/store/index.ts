// The Memory (Redux)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; //knows how to update (handles) authentication-related state.

// This bundles all your memory slices into one central store.
export const store = configureStore({
// auth becomes a key in your global state.
// authReducer controls everything inside state.auth.
  reducer: {
    auth: authReducer,
  },
});

// These types are for TypeScript to help us later
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;