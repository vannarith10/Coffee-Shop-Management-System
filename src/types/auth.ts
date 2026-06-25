// types/auth.ts

export enum Role {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  BARISTA = "BARISTA",
}

export interface UserInfo {
  id: string;
  username: string;
  role: Role;
}

export interface RefreshToken {
  token: string;
  expires_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh: RefreshToken;
  user_info: UserInfo;
}

//===== REFRESH TOKEN =====//

export interface RefreshRequest {
  token: string;
}

export interface RefreshResponse {
  access_token: string;
  tokenType: string;
  expiresIn: number;
  refresh: RefreshToken;
  user_info: UserInfo;
}
