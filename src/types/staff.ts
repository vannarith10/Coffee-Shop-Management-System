import type { Pagination } from "./common";
import type { RoleType, Status, Shift, Schedule } from "./enums";

export interface Staff {
  id: string;
  name: string;
  username: string;
  role: RoleType;
  shift: Shift;
  schedules: Schedule[];
  email: string;
  phone_number: string;
  status: Status;
  image_url: string;
}

export interface StaffProfileResponse {
  message: string;
  pagination: Pagination;
  staffs: Staff[];
}

export interface EditStaffDataRequest {
  name: string | null;
  username: string | null;
  password: string | null;
  email: string | null;
  role: RoleType | null;
  status: Status | null;
  shift_type: Shift | null;
  schedules: Schedule[] | null;
}

export interface CreateStaffRequest {
  full_name: string;
  username: string;
  password: string;
  role: RoleType;
  shift: Shift;
  schedules: Schedule[];
  status: Status;
}

export type CreateStaffResponse = Staff;
