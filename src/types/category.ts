// types/category.ts

export const CATEGORY_COLOR_CONFIG = {
  FOOD: {
    label: "FOOD",
    bgColor: "bg-amber-600",
  },
  DRINK: {
    label: "DRINK",
    bgColor: "bg-blue-600",
  },
  ALL: {
    label: "ALL",
    bgColor: "bg-green-600",
  },
} as const;


export type CATEGORY_TYPE = "FOOD" | "DRINK";

export type CATEGORY_STATUS = boolean;


export interface GetAllCategoriesResponse {
    pagination: {
        page: number,
        size: number,
        total_pages: number,
        total_items: number
    },
    categories: Category []
}

export interface Category {
    category_id: string;
    category_name: string;
    category_type: CATEGORY_TYPE;
    is_active: boolean;
}



export const CATEGORY_TYPES_ARRAY: CATEGORY_TYPE[] = [
  "FOOD",
  "DRINK",
];



export const CategoryStatusOptions = [
  { label: "Enable", value: true },
  { label: "Disable", value: false },
];



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