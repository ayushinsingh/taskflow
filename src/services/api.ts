import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  // Required for the httpOnly auth cookie to be sent cross-origin. The server
  // must answer with credentials:true and an explicit origin -- a wildcard
  // Access-Control-Allow-Origin is rejected by the browser when this is set.
  withCredentials: true,
});

export default api;
