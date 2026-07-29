import type { AuthResponse } from "../types/api/auth.types";
import api from "./api";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  },
  me: async (): Promise<Pick<AuthResponse, "user">> => {
    const response = await api.get("/auth/me");
    return response.data;
  }
}