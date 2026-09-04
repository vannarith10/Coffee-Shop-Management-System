

import type { UserInfo } from "./user";
import type { Role } from "./role";


export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;

  refresh: {
    token: string;
    expires_at: string;
  };

  user_info: UserInfo;
}
