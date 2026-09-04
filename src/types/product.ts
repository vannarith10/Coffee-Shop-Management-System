// types/product.ts
//
import type { CATEGORY_TYPE } from "./category/category";
import type { Pagination } from "./pagination";

export type PRODUCT_STOCK_STATUS = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export const STOCK_STATUS = {
  normal: "IN_STOCK",
  low: "LOW_STOCK",
  out: "OUT_OF_STOCK",
};

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

interface TopProduct {
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

// --------------------------------
// Cashier | Product Menu Response
// --------------------------------
export interface ProductMenuResponse {
  pagination: Pagination;
  items: ProductMenuItem[];
}

// --------------------------------
// Cashier | Product Menu Item
// --------------------------------
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
