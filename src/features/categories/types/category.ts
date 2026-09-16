import z from "zod";
import type { CategoryType } from "./enums";
import type { createCategorySchema } from "@/features/categories/schemas/category.schema";
import type { PaginationType } from "@/types";

export type CATEGORY_STATUS = boolean;

export interface Category {
  category_id: string;
  category_name: string;
  category_type: CategoryType;
  is_active: boolean;
}

export interface GetAllCategoriesResponse {
  pagination: PaginationType;
  categories: Category[];
}

export const CategoryStatusOptions = [
  { label: "Enable", value: true, bg: "bg-green-600" },
  { label: "Disable", value: false, bg: "bg-red-500" },
] as const;

export interface PatchCategoryRequest {
  new_name: string | null;
  new_type: CategoryType | null;
  new_status: boolean | null;
}

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;

export interface CategoryStatusSummaryResponse {
  total_categories: number;
  total_drinks: number;
  total_foods: number;
  total_disables: number;
}

export interface GetSalesByCategoryResponse {
  category_id: string;
  category_name: string;
  category_type: CategoryType;
  revenue: number;
}
