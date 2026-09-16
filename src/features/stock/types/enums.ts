// ----------------------------------------------
//
// Product Stock
//
// ----------------------------------------------
export const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;
export const STOCK_STATUS_ARRAY = Object.values(STOCK_STATUS);
