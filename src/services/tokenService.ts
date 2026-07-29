const tokenKey = "taskflow_access_token";
export const tokenService = {
  getToken: () => {
    const token  = localStorage.getItem(tokenKey);
    return token;
  },
  setToken: (token: string) => {
    localStorage.setItem(tokenKey, token);
  },
  clearToken: () => {
    localStorage.removeItem(tokenKey);
  }
}