// types/staff.ts
//

import type { Pagination } from "./pagination";
import type { Role } from "./role";
import type { Schedule } from "./schedule";
import type { Shift } from "./Shift";
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
