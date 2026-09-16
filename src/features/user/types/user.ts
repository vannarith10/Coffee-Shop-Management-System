import type { RoleType } from "@/features/staff/types/enums";

export interface GetUserProfileResponse {
  user_id: string;
  username: string;
  name: string;
  image_url: string | null;
  role: RoleType;
}