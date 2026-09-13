import type { Pagination } from "./common";
import type { PRODUCT_STOCK_STATUS, CATEGORY_TYPE } from "./enums"; // Updated import

export const STOCK_STATUS = {
  normal: "IN_STOCK",
  low: "LOW_STOCK",
  out: "OUT_OF_STOCK",
} as const;

export const STOCK_STATUS_CONFIG = {
  IN_STOCK: {
    label: "IN",
    bg: "bg-green-600",
    bg50: "bg-green-600/50",
    bg20: "bg-green-600/20",
    bg_hover: "hover:bg-green-600",
    bg50_hover: "hover:bg-green-600/50",
    bg20_hover: "hover:bg-green-600/20",
  },
  LOW_STOCK: {
    label: "LOW",
    bg: "bg-amber-600",
    bg50: "bg-amber-600/50",
    bg20: "bg-amber-600/20",
    bg_hover: "hover:bg-amber-600",
    bg50_hover: "hover:bg-amber-600/50",
    bg20_hover: "hover:bg-amber-600/20",
  },
  OUT_OF_STOCK: {
    label: "OUT",
    bg: "bg-red-600",
    bg50: "bg-red-600/50",
    bg20: "bg-red-600/20",
    bg_hover: "hover:bg-red-600",
    bg50_hover: "hover:bg-red-600/50",
    bg20_hover: "hover:bg-red-600/20",
  },
} as const;

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
    label: "In",
    description: "Stock level is healthy",
    accent: "accent-green-600",
    border: "border-green-500",
    bg: "bg-green-500/50",
    color: "green-600",
  },
  {
    value: "LOW_STOCK",
    label: "Low",
    description: "Stock is running low",
    accent: "accent-yellow-600",
    border: "border-yellow-500",
    bg: "bg-yellow-500/50",
    color: "amber-600",
  },
  {
    value: "OUT_OF_STOCK",
    label: "Out",
    description: "Out of stock",
    accent: "accent-red-600",
    border: "border-red-500",
    bg: "bg-red-500/50",
    color: "red-600",
  },
];

export interface ProductStock {
  id: string;
  name: string;
  category_name: string;
  category_type: CATEGORY_TYPE;
  status: PRODUCT_STOCK_STATUS;
}

export interface StockStatusResponse {
  message: string;
  pagination: Pagination;
  products: ProductStock[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost_price: number;
  description: string | null;
  image_url: string | null;
  category_type: CATEGORY_TYPE;
  category_name: string;
  stock_status: PRODUCT_STOCK_STATUS;
  created_at: string;
  updated_at: string | null;
}

export interface AdminProductResponse {
  pagination: Pagination;
  product_items: Product[];
}

export interface UpdateProductRequest {
  name: string | null | undefined;
  category_name: string | null | undefined;
  selling_price: number | null | undefined;
  cost_price: number | null | undefined;
  description: string | null | undefined;
  stock_status: PRODUCT_STOCK_STATUS | null | undefined;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  image_url: string;
  units_sold: number;
}

export interface TopSellingResponse {
  pagination: Pagination;
  units_target: number;
  top_products: TopProduct[];
}

export interface AddNewProductRequest {
  name: string;
  selling_price: number;
  cost_price: number;
  category_name: string;
  stock_status: PRODUCT_STOCK_STATUS;
  description: string | null;
}

export interface ProductMenuResponse {
  pagination: Pagination;
  items: ProductMenuItem[];
}

export interface ProductMenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category_type: CATEGORY_TYPE;
  category_name: string;
  is_category_active: boolean;
  is_available: boolean;
  stock_status: PRODUCT_STOCK_STATUS;
}
