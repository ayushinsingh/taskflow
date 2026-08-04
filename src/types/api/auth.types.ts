export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Login and signup both return only the user. The access token travels as an
 * httpOnly cookie, which JavaScript cannot read by design -- so there is no
 * token field here, and nothing on the client ever holds one.
 */
export interface AuthResponse {
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}
