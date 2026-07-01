// hooks/useCategory
//

import { useEffect, useMemo, useState } from "react";
import type { GetAllCategoriesResponse, Category } from "../types/category";
import { getAllCategories } from "../services/admin.service";
import { toast } from "sonner";
import { updateCategory } from "../utils/data-cache-update";
import { useCategoryUpdate } from "./useCategoryUpdate";

export function useCategory(page: number = 1, size: number = 20) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageCache, setPageCache] = useState<
    Record<number, GetAllCategoriesResponse>
  >({});

  const category = useMemo(() => pageCache[page] ?? null, [pageCache, page]);

  useEffect(() => {
    if (pageCache[page]) {
      return;
    }

    async function fetchData() {
      setIsLoading(true);

      try {
        const res = await getAllCategories({ page, size });
        setPageCache((prev) => ({...prev, [page]: res.data}));
      } catch (error) {
        console.error(error);
        setIsError(true);
        toast.error("Error loading categories");
      } finally {
        setTimeout(() => {setIsLoading(false)}, 1000);
      }
    }

    fetchData();
  }, [page, size, pageCache]);

  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(
    null,
  );

  // Highlight the field that just updated for 3s
  useEffect(() => {
    setTimeout(() => {setJustUpdateFieldId(null)}, 3000)
  }, [justUpdatedFieldId]);

  // Function used to update category with WebSocket
  const updateCacheCategory = (category: Category) => {
    setPageCache((prev) => updateCategory(prev, category));
    setJustUpdateFieldId(category.category_id);
  };

  
  //====================================
  // Update Category with WebSocket
  //====================================
  useCategoryUpdate({onCategoryUpdate: updateCacheCategory});

  return { category, pageCache, isLoading, isError, updateCacheCategory, justUpdatedFieldId };
}
