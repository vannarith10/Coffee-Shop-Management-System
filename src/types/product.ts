// types/product.ts
//
import type { CATEGORY_TYPE } from "./category";
import type { Pagination } from "./pagination";


export type PRODUCT_STOCK_STATUS = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export const STOCK_STATUS = {
    normal: "IN_STOCK",
    low: "LOW_STOCK",
    out: "OUT_OF_STOCK"
}

export interface Product {
  id: string;
  name: string;
  category_name: string;
  category_type: CATEGORY_TYPE;
  status: PRODUCT_STOCK_STATUS;
}


export interface StockStatusResponse {
  message: string;
  pagination: Pagination;
  products: Product[];
}