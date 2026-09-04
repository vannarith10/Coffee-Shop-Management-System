

import type { UserInfo } from "./auth";
import type { Role } from "./role";


export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;

  refresh: {
    token: string;
    expires_at: string;
  };

  user_info: UserInfo;
}
