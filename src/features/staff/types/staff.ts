import type { PaginationType } from "@/types";
import type { RoleType, StatusType, ShiftType, ScheduleType } from "./enums";

export interface Staff {
  id: string;
  name: string;
  username: string;
  role: RoleType;
  shift: ShiftType;
  schedules: ScheduleType[];
  email: string;
  phone_number: string;
  status: StatusType;
  image_url: string;
}

export interface StaffProfileResponse {
  message: string;
  pagination: PaginationType;
  staffs: Staff[];
}

export interface EditStaffDataRequest {
  name: string | null;
  username: string | null;
  password: string | null;
  email: string | null;
  role: RoleType | null;
  status: StatusType | null;
  shift_type: ShiftType | null;
  schedules: ScheduleType[] | null;
}

export interface CreateStaffRequest {
  full_name: string;
  username: string;
  password: string;
  role: RoleType;
  shift: ShiftType;
  schedules: ScheduleType[];
  status: StatusType;
}

export type CreateStaffResponse = Staff;
