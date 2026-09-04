// types/auth.ts

import type { UserInfo } from "./user";


export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh: {
    token: string;
    expires_at: string;
  };
  user_info: UserInfo;
}
