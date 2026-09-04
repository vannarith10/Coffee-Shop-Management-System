import type { Role } from "./role";


export interface UserInfo {
  id: string;
  username: string;
  role: Role;
  image_url: string;
}


export interface GetUserProfileResponse {
    user_id: string;
    username: string;
    name: string;
    image_url: string | null;
    role: Role;
}