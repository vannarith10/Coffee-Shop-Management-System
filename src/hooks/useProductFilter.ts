import type { CategoryType } from "@/types";
import { create } from "zustand";

type ProductFilterStore = {
  selectedCategoryType: CategoryType | "ALL";
  selectedCategoryName: string | null;
  keyword: string | null;
  setSelectedCategoryType: (type: CategoryType | "ALL") => void;
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
