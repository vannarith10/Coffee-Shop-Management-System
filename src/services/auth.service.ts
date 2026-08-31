//
// service/auth.service.ts
//
import type { AxiosError } from "axios";
import { authApi } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";
import type { BackendErrorDetail } from "../types/error";



// ----------------------------------------------------------------
//
// Login
//
// ----------------------------------------------------------------
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    "/api/v2/auth/login",
    payload,
  );
  return response.data;
};





// ----------------------------------------------------------------
//
// Refresh Token
//
// ----------------------------------------------------------------
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await authApi.post("/api/v2/token/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorDetail>;
    console.error("Detail:", axiosError.response?.data.detail);
    throw error;
  }
};
