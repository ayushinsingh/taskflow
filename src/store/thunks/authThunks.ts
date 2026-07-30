import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import axios from "axios";
import { tokenService } from "../../services/tokenService";
import type { RootState } from "..";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}


export const login = createAsyncThunk("app/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.login(email, password);
    tokenService.setToken(response.accessToken);
    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Error while login");
    return rejectWithValue(message);
  }

});
export const signup = createAsyncThunk("app/signup", async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.signup(name, email, password);
    tokenService.setToken(response.accessToken);
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
    if (axios.isAxiosError(error) && error.response?.status === 401) tokenService.clearToken();
    return rejectWithValue(message);
  }
}, {
  condition: (_arg, { getState }) => {
    const { status } = (getState() as RootState).auth;
    return status !== "loading";
  },
},);