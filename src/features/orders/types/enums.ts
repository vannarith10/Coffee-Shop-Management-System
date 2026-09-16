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