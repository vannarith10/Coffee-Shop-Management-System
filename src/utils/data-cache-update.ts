// utils/staff-cache.ts
//

import type {
  Category,
  GetAllCategoriesResponse,
} from "../types/category/category";
import type { ProductStock, StockStatusResponse } from "../types/product";
import type { Staff, StaffProfileResponse } from "../types/staff";

// ==========================================
// This used to update new staff's details
// ==========================================
export function updateStaffInCache(
  cache: Record<number, StaffProfileResponse>,
  updatedStaff: Staff,
) {
  const newCache = { ...cache };

  for (const pageNumber in newCache) {
    newCache[Number(pageNumber)] = {
      ...newCache[Number(pageNumber)],
      staffs: newCache[Number(pageNumber)].staffs.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff,
      ),
    };
  }

  return newCache;
}

// ======================================
// For updating stock status
// ======================================
export function updateStockStatusInCache(
  cache: Record<number, StockStatusResponse>,
  updatedStock: ProductStock,
) {
  const newCache = { ...cache };

  for (const pageNumber in newCache) {
    newCache[Number(pageNumber)] = {
      ...newCache[Number(pageNumber)],
      products: newCache[Number(pageNumber)].products.map((product) =>
        product.id === updatedStock.id ? updatedStock : product,
      ),
    };
  }

  return newCache;
}

//=======================
// Update Category
//=======================
export function updateCategory(
  cache: Record<number, GetAllCategoriesResponse>,
  updatedCategory: Category,
) {
  const newCache = { ...cache };

  for (const pageNumber in newCache) {
    newCache[Number(pageNumber)] = {
      ...newCache[Number(pageNumber)],
      categories: newCache[Number(pageNumber)].categories.map((category) =>
        category.category_id === updatedCategory.category_id
          ? updatedCategory
          : category,
      ),
    };
  }

  return newCache;
}

//============================================
// Add New Created Category to the Cache
//============================================
export function addCategory(
  prevCache: Record<number, GetAllCategoriesResponse>,
  newCategory: Category,
  pageSize: number = 20,
): Record<number, GetAllCategoriesResponse> {
  const newCache = { ...prevCache };

  // Update page 1: prepend new category
  if (newCache[1]) {
    const page1 = newCache[1];
    const newCategories = [newCategory, ...page1.categories];

    // If page 1 exceeds size, trim the last item (it "pushed" to page 2)
    if (newCategories.length > pageSize) {
      newCategories.pop();
    }

    newCache[1] = {
      ...page1,
      categories: newCategories,
      pagination: {
        ...page1.pagination,
        total_items: page1.pagination.total_items + 1,
      },
    };
  }

  // Invalidate pages 2+ — their item offsets are now wrong
  // (A new item at the top shifts everything down)
  Object.keys(newCache).forEach((key) => {
    const pageNum = Number(key);
    if (pageNum > 1) {
      delete newCache[pageNum];
    }
  });

  return newCache;
}
