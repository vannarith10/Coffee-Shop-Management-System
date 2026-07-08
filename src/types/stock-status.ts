import type { PRODUCT_STOCK_STATUS } from "./product";

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


export const STATUS_OPTIONS: {
  value: PRODUCT_STOCK_STATUS;
  label: string;
  description: string;
  accent: string;
  border: string;
  bg: string;
  color: string;
}[] = [
  {
    value: "IN_STOCK",
    label: "Normal",
    description: "Stock level is healthy",
    accent: "accent-green-600",
    border: "border-green-500",
    bg: "bg-background-secondary",
    color:  "green-600",
  },
  {
    value: "LOW_STOCK",
    label: "Low",
    description: "Stock is running low",
    accent: "accent-yellow-600",
    border: "border-yellow-500",
    bg: "bg-background-secondary",
    color:  "yellow-600",
  },
  {
    value: "OUT_OF_STOCK",
    label: "Out",
    description: "Out of stock",
    accent: "accent-red-600",
    border: "border-red-500",
    bg: "bg-background-secondary",
    color:  "red-600",
  },
];
