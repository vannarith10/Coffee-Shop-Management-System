import z from "zod";

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
export const STATUS = ["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED"] as const;
export type Status = (typeof STATUS)[number];
export const STATUSES: Status[] = [...STATUS];
export const USER_STATUS_COLOR_CONFIG: Record<
  Status,
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
export const SHIFT = ["MORNING", "AFTERNOON", "FULL_DAY"] as const;
export type Shift = (typeof SHIFT)[number];
export const SHIFT_ORDER: Shift[] = [...SHIFT];

// ----------------------------------------------
//
// Schedule
//
// ----------------------------------------------
export const SCHEDULES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
export type Schedule = (typeof SCHEDULES)[number];
export const DAY_ORDER: Schedule[] = [...SCHEDULES];
export const SCHEDULE_CONFIG: Record<Schedule, { label: string }> = {
  MONDAY: { label: "Mon" },
  TUESDAY: { label: "Tue" },
  WEDNESDAY: { label: "Wed" },
  THURSDAY: { label: "Thu" },
  FRIDAY: { label: "Fri" },
  SATURDAY: { label: "Sat" },
  SUNDAY: { label: "Sun" },
} as const;

// ----------------------------------------------
//
// Order
//
// ----------------------------------------------
export const ORDER_STATUS = [
  "CREATED",
  "QUEUED",
  "PREPARING",
  "DONE",
  "PAYMENT_PENDING",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];
export type PaymentMethod = "CASH" | "QR";

// ----------------------------------------------
//
// Analytics
//
// ----------------------------------------------
export const RANGES = [
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "THIS_YEAR",
  "ALL",
] as const;
export type Range = (typeof RANGES)[number];

// ----------------------------------------------
//
// Product Stock
//
// ----------------------------------------------
export type ProductStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type PRODUCT_STOCK_STATUS = ProductStockStatus; // Backward compatibility

// ----------------------------------------------
//
// Category
//
// ----------------------------------------------
export const CATEGORY_TYPES = ["FOOD", "DRINK"] as const;
export type CATEGORY_TYPE = (typeof CATEGORY_TYPES)[number];
export const CATEGORY_TYPES_ARRAY: CATEGORY_TYPE[] = [...CATEGORY_TYPES];
export const CATEGORY_COLOR_CONFIG: Record<
  CATEGORY_TYPE | "ALL",
  { label: string; bgColor: string }
> = {
  FOOD: { label: "FOOD", bgColor: "bg-amber-600" },
  DRINK: { label: "DRINK", bgColor: "bg-blue-600" },
  ALL: { label: "ALL", bgColor: "bg-green-600" },
} as const;
