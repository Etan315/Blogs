// The Memory (Redux)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

//Defines what slice stores
interface AuthState {
  user: any | null; //null means “not logged in”.
}

const initialState: AuthState = { user: null };

// This is a "reducer"—a specific instruction that says "Update the notepad with this user's information."
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This function updates the "user" in our store
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;