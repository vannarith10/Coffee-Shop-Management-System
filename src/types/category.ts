import type { CATEGORY_TYPE } from "./enums";

export type CATEGORY_STATUS = boolean;

export interface Category {
  category_id: string;
  category_name: string;
  category_type: CATEGORY_TYPE;
  is_active: boolean;
}

export interface GetAllCategoriesResponse {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
    total_items: number;
  };
  categories: Category[];
}

export const CategoryStatusOptions = [
  { label: "Enable", value: true, bg: "bg-green-600" },
  { label: "Disable", value: false, bg: "bg-red-500" },
] as const;

export interface PatchCategoryRequest {
  new_name: string | null;
  new_type: CATEGORY_TYPE | null;
  new_status: boolean | null;
}

export interface CreateCategoryRequest {
  type: CATEGORY_TYPE;
  name: string;
  is_active: boolean;
}

export interface CategoryStatusSummaryResponse {
  total_categories: number;
  total_drinks: number;
  total_foods: number;
  total_disables: number;
}

export interface GetSalesByCategoryResponse {
  category_id: string;
  category_name: string;
  category_type: CATEGORY_TYPE;
  revenue: number;
}
