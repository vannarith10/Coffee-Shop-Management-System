// ----------------------------------------------
//
// Role
//
// ----------------------------------------------
export const ROLES = {
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  BARISTA: "BARISTA",
  STAFF: "STAFF",
} as const;
export const ROLES_ARRAY = Object.values(ROLES);
export type RoleType = (typeof ROLES_ARRAY)[number];

// ----------------------------------------------
//
// Status
//
// ----------------------------------------------
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ON_LEAVE: "ON_LEAVE",
  SUSPENDED: "SUSPENDED",
} as const;
export const STATUS_ARRAY = Object.values(STATUS);
export type StatusType = (typeof STATUS_ARRAY)[number];
export const STATUSES: StatusType[] = [...STATUS_ARRAY];
export const USER_STATUS_COLOR_CONFIG: Record<
  StatusType,
  { background_color: string }
> = {
  ACTIVE: { background_color: "bg-green-600" },
  INACTIVE: { background_color: "bg-amber-600" },
  ON_LEAVE: { background_color: "bg-blue-600" },
  SUSPENDED: { background_color: "bg-red-800" },
};

// ----------------------------------------------
//
// Shift
//
// ----------------------------------------------
export const SHIFT = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  FULL_DAY: "FULL_DAY",
} as const;
export const SHIFT_ARRAY = Object.values(SHIFT);
export type ShiftType = (typeof SHIFT_ARRAY)[number];
export const SHIFT_ORDER: ShiftType[] = [...SHIFT_ARRAY];

// ----------------------------------------------
//
// Schedule
//
// ----------------------------------------------
export const SCHEDULES = {
  MONDAY: "MONDAY",
  TUESDAT: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;
export const SCHEDULE_ARRAY = Object.values(SCHEDULES);
export type ScheduleType = (typeof SCHEDULE_ARRAY)[number];
export const DAY_ORDER: ScheduleType[] = [...SCHEDULE_ARRAY];
export const SCHEDULE_CONFIG: Record<ScheduleType, { label: string }> = {
  MONDAY: { label: "Mon" },
  TUESDAY: { label: "Tue" },
  WEDNESDAY: { label: "Wed" },
  THURSDAY: { label: "Thu" },
  FRIDAY: { label: "Fri" },
  SATURDAY: { label: "Sat" },
  SUNDAY: { label: "Sun" },
} as const;