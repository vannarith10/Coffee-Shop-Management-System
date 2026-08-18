// types/staff.ts
//

import type { Pagination } from "./pagination";
import type { Role } from "./role";
import type { Schedule } from "./schedule";
import type { Shift } from "./shift";
import type { Status } from "./status";



export interface Staff {
    id: string;
    name: string;
    username: string;
    role: Role;
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
  role: Role | null;
  status: Status | null;
  shift_type: Shift | null;
  schedules: Schedule[] | null;
}


export interface CreateStaffRequest {
  full_name: string;
  username: string;
  password: string;
  role: Role;
  shift: Shift;
  schedules: Schedule[];
  status: Status;
}

export interface CreateStaffResponse {
  id: string;
  name: string;
  username: string;
  role: Role;
  shift: Shift;
  schedules: Schedule[];
  email: string;
  phone_number: string;
  status: Status;
  image_url: string;
}
