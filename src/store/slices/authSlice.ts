import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/api/auth.types";
import type { LoadStatus } from "../../types/normalized.type";
import { login, signup, me } from "../thunks/authThunks";

interface AuthState {
  user: AuthUser | null;
  status: LoadStatus;
  error: string | null;
}

// No token field: it lives in an httpOnly cookie the client cannot read, so
// `user` plus `status` carry the whole auth state. `status: "idle"` now means
// "we have not asked the server yet", never "logged out".
const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      const {user} = action.payload;
      state.user = user;
      state.status = "succeeded";
    }).addCase(me.rejected, (state,) => {
      state.user = null;
      state.status = "failed";
    }).addMatcher(isAnyOf(login.pending, signup.pending, me.pending), (state) => {
      state.status = "loading";
      state.error = null;
    }).addMatcher(isAnyOf(login.fulfilled, signup.fulfilled), (state, action) => {
      state.error = null;
      state.status = "succeeded";
      state.user = action.payload.user;
    }).addMatcher(isAnyOf(login.rejected, signup.rejected), (state, action) => {
      state.error = action.payload as string;
      state.status = "failed";
      state.user = null;
    })
  }
});

export const {clearError, logout} = authSlice.actions;

export default authSlice.reducer;