//lib/axios.ts

import axios from "axios";
import { authStorage } from "../utils/auth-storage";
import { refreshAccessToken } from "../services/auth.service";
import type { RefreshResponse } from "../types/auth";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For Login/Refresh only
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// For public endpoints that no need auth
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// For everything else
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor : attach access token
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor : handle 401 + refresh
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Get new token
        const refreshResponse: RefreshResponse =
          await refreshAccessToken(refreshToken);

        // Store new tokens
        authStorage.setAccessToken(refreshResponse.access_token);
        authStorage.setRefreshToken(refreshResponse.refresh.token);

        // Retry with new token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.remove();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
