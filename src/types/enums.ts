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

// ----------------------------------------------
//
// Order
//
// ----------------------------------------------
export const ORDER_STATUS = {
  CREATED: "CREATED",
  QUEUED: "QUEUED",
  PREPARING: "PREPARING",
  DONE: "DONE",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  CANCELLED: "CANCELLED",
} as const;
export const ORDER_STATUS_ARRAY = Object.values(ORDER_STATUS);
export type OrderStatusType = (typeof ORDER_STATUS_ARRAY)[number];

// ----------------------------------------------
//
// Paymenst Method
//
// ----------------------------------------------
export const PAYMENT_METHOD = {
  CASH: "CASH",
  QR: "QR",
} as const;
export const PAYMENT_METHOD_ARRAY = Object.values(PAYMENT_METHOD);
export type PaymentMethodType = (typeof PAYMENT_METHOD_ARRAY)[number];

// ----------------------------------------------
//
// Analytics
//
// ----------------------------------------------
export const RANGE = {
  TODAY: "TODAY",
  THIS_WEEK: "THIS_WEEK",
  THIS_MONTH: "THIS_MONTH",
  THIS_YEAR: "THIS_YEAR",
  ALL: "ALL",
} as const;
export const RANGE_ARRAY = Object.values(RANGE);
export type RangeType = (typeof RANGE_ARRAY)[number];

// ----------------------------------------------
//
// Product Stock
//
// ----------------------------------------------
export const STOCK_STATUS = {
  INSTOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;
export const STOCK_STATUS_ARRAY = Object.values(STOCK_STATUS);
export type StockStatusType = (typeof STOCK_STATUS_ARRAY)[number];
// export type PRODUCT_STOCK_STATUS = ProductStockStatus; // Backward compatibility

// ----------------------------------------------
//
// Category
//
// ----------------------------------------------
export const CATEGORY = { FOOD: "FOOD", DRINK: "DRINK" } as const;
export const CATEGORY_ARRAY = Object.values(CATEGORY);
export type CategoryType = (typeof CATEGORY_ARRAY)[number];
// export const CATEGORY_TYPES_ARRAY: CATEGORY_TYPE[] = [...CATEGORY_TYPES];
export const CATEGORY_COLOR_CONFIG: Record<
  CategoryType | "ALL",
  { label: string; bgColor: string }
> = {
  FOOD: { label: "FOOD", bgColor: "bg-amber-600" },
  DRINK: { label: "DRINK", bgColor: "bg-blue-600" },
  ALL: { label: "ALL", bgColor: "bg-green-600" },
} as const;
