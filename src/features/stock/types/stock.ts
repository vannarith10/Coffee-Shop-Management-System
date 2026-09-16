import { STOCK_STATUS, type STOCK_STATUS_ARRAY } from "./enums";
import z from "zod";
import { CATEGORY } from "../../categories/types/enums";
import type { PaginationType } from "@/types";

export type StockStatusType = (typeof STOCK_STATUS_ARRAY)[number];

export const productStockSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category_name: z.string(),
  category_type: z.enum(CATEGORY),
  status: z.enum(STOCK_STATUS),
});

export type ProductStock = z.infer<typeof productStockSchema>;

export interface StockStatusResponse {
  message: string;
  pagination: PaginationType;
  products: ProductStock[];
}
