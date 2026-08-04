import type { AuthResponse, MeResponse } from "../types/api/auth.types";
import api from "./api";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  signup: async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  },
  me: async (): Promise<MeResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  // Server-side clearCookie -- the client cannot delete an httpOnly cookie
  // itself, so logging out genuinely requires this round trip.
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
