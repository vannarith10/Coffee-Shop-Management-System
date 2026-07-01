// types/category.ts


export type CATEGORY_TYPE = "FOOD" | "DRINK";


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

