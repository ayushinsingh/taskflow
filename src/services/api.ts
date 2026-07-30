import axios from "axios";
import { tokenService } from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use(
  function(config) {
    const token = tokenService.getToken();
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  }
)

export default api;