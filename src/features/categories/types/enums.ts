// ----------------------------------------------
//
// Category
//
// ----------------------------------------------
export const CATEGORY = { FOOD: "FOOD", DRINK: "DRINK" } as const;
export const CATEGORY_ARRAY = Object.values(CATEGORY);
export type CategoryType = (typeof CATEGORY_ARRAY)[number];
// export const CATEGORY_TYPES_ARRAY: CATEGORY_TYPE[] = [...CATEGORY_TYPES];
export const CATEGORY_COLOR_CONFIG: Record<
  CategoryType | "ALL",
  { label: string; bgColor: string }
> = {
  FOOD: { label: "FOOD", bgColor: "bg-amber-600" },
  DRINK: { label: "DRINK", bgColor: "bg-blue-600" },
  ALL: { label: "ALL", bgColor: "bg-green-600" },
} as const;