import type { CATEGORY_TYPE } from "../types/category/category";
import { create } from "zustand";

type ProductFilterStore = {
  selectedCategoryType: CATEGORY_TYPE | "ALL";
  selectedCategoryName: string | null;
  keyword: string | null;
  setSelectedCategoryType: (type: CATEGORY_TYPE | "ALL") => void;
  setSelectedCategoryName: (name: string | null) => void;
  setKeyword: (keyword: string | null) => void;
};

export const useProductFilter = create<ProductFilterStore>((set) => ({
  selectedCategoryType: "ALL",
  selectedCategoryName: null,
  keyword: null,

  setSelectedCategoryType: (type) => set({ selectedCategoryType: type }),
  setSelectedCategoryName: (name) => set({ selectedCategoryName: name }),
  setKeyword: (keyword) => set({ keyword: keyword }),
}));
