export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser,
  accessToken: string;
}

export interface MeResponse {
  user: AuthUser
}