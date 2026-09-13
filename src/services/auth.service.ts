//
// service/auth.service.ts
//
import type { AxiosError } from "axios";
import { authApi } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";
import type { BackendErrorDetail } from "@/types";
import type { RefreshTokenResponse } from "@/types";



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
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await authApi.post("/api/v2/token/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorDetail>;
    console.error(axiosError.response?.data.detail);
    throw error;
  }
};
