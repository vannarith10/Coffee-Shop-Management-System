import type { Role } from "./role";



export interface GetUserProfileResponse {
    user_id: string;
    username: string;
    name: string;
    image_url: string | null;
    role: Role;
}