// service/auth.service.ts
import type { AxiosError } from "axios";
import { authApi } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  detail: string;
}


// LOGIN
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    "/api/v2/auth/login",
    payload,
  );
  return response.data;
};



// GET NEW ACCESS TOKEN FROM REFRESH TOKEN
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await authApi.post("/api/v2/token/get-access-token", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
        const data = axiosError.response.data;
      // Server responded with a status outside 2xx
      console.error("Error Message:", data.message);
      console.error("Status:", data.status);
      console.error("Detail:", data.detail);
    } else if (axiosError.request) {
        // Request was made but no response received
      console.error("No response received:", axiosError.request);
    }
    throw error;
  }
};
