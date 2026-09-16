import type { RoleType } from "@/features/staff/types/enums";

export interface UserInfo {
  id: string;
  username: string;
  role: RoleType;
  image_url: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh: {
    token: string;
    expires_at: string;
  };
}

export interface LoginResponse extends AuthTokens {
  user_info: UserInfo;
}

export type RefreshTokenResponse = LoginResponse;
