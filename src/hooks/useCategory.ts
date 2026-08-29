//
// hooks/useCategory
//
import { useEffect, useState } from "react";
import { getAllCategories } from "../services/admin/category";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, GetAllCategoriesResponse } from "../types/category";
import { useCategoryCreate } from "./websockets/useCategoryCreate";



export function useCategory(page: number = 1, size: number = 10) {
  const queryClient = useQueryClient();
  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(
    null,
  );
  const [justCreatedCategoryId, setJustCreatedCategoryId] = useState<
    string | null
  >(null);
  const queryKey = ["category", page, size];


  // Fetch
  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<GetAllCategoriesResponse>({
      queryKey,
      queryFn: () => getAllCategories({ page, size }).then((res) => res.data),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // ===========================
  // Fetch next page
  // ===========================
  const totalPages = data?.pagination.total_pages ?? 1;
  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    queryClient.prefetchQuery({
      queryKey: ["category", nextPage, size],
      queryFn: () =>
        getAllCategories({ page: nextPage, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });
  }, [data, page, totalPages, size, queryClient]);

  // =================================================
  // WebSocket - Add a new Category that just created
  // =================================================
  function handleAddNewCategory(newCategory: Category) {
    setJustCreatedCategoryId(newCategory.category_id);
    queryClient.setQueriesData<GetAllCategoriesResponse>(
      { queryKey: ["category"] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          // update total items to all pages
          pagination: {
            ...oldData.pagination,
            total_items: oldData.pagination.total_items + 1,
          },

          // add a new created to only the current page, not to all pages
          categories:
            oldData.pagination.page === page
              ? [...oldData.categories, newCategory]
              : oldData.categories,
        };
      },
    );
  }
  useCategoryCreate({ onCategoryCreate: handleAddNewCategory });

  // Clear category id after 5 sec
  useEffect(() => {
    setTimeout(() => setJustCreatedCategoryId(null), 5000);
  }, [justCreatedCategoryId]);

  return {
    category: data ?? null,
    isLoading,
    isError,
    isRefetching,
    refetch,
    justUpdatedFieldId,
    justCreatedCategoryId,
  };
}
