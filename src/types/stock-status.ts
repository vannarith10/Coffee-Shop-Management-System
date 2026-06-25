// constants/stockStatus.ts
export const STOCK_STATUS_CONFIG = {
  IN_STOCK: {
    label: "IN",
    colorClass: "bg-green-600",
  },
  LOW_STOCK: {
    label: "LOW",
    colorClass: "bg-amber-600",
  },
  OUT_OF_STOCK: {
    label: "OUT",
    colorClass: "bg-red-600",
  },
} as const;

// Type-safe helper: ensures every PRODUCT_STOCK_STATUS has config
export type StockStatusKey = keyof typeof STOCK_STATUS_CONFIG;