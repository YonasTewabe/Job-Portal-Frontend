import axios from "axios";
import Cookies from "js-cookie";
import { clearSession } from "./utils/session";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"}`,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and let the app re-render to /login
      clearSession();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
