import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import type { RootState } from "..";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { logout } from "../slices/authSlice";

export const login = createAsyncThunk("app/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.login(email, password);
    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Error while login");
    return rejectWithValue(message);
  }

});
export const signup = createAsyncThunk("app/signup", async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.signup(name, email, password);
    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Error while signup");
    return rejectWithValue(message);
  }

});
export const me = createAsyncThunk("app/me", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.me();
    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Error while fetching loggedin user detail");
    return rejectWithValue(message);
  }
}, {
  condition: (_arg, { getState }) => {
    const { status } = (getState() as RootState).auth;
    return status !== "loading";
  },
},);

/**
 * Clears the cookie server-side, then wipes local state. The `logout` action is
 * dispatched in `finally` on purpose: if the request fails the cookie may
 * survive, but leaving the user staring at a populated dashboard they asked to
 * leave is worse. The next request 401s and ProtectedRoute takes over.
 */
export const logoutUser = createAsyncThunk(
  "app/logoutUser",
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout());
    }
  },
);
