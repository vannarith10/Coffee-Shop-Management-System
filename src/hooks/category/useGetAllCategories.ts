// ---------------------------------------------------------------------------
//
// All categories that are being displayed on Category tab of Admin Dashboard
//
// ---------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/admin/category";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Category,
  GetAllCategoriesResponse,
} from "../../types/category/category";
import { useCategoryCreate } from "../../websocket/category/useCreateCategoryWebsocket";
import { useUpdateCategoryWebsocket } from "../../websocket/category/useUpdateCategoryWebsocket";

export function useGetAllCategories (page: number = 1) {
  const size = 10;
  const queryClient = useQueryClient();
  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(
    null,
  );
  const [justCreatedCategoryId, setJustCreatedCategoryId] = useState<
    string | null
  >(null);
  const queryKey = ["category", page, size];

  // ----------------------------------------
  //
  // Fetching data
  //
  // ----------------------------------------
  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<GetAllCategoriesResponse>({
      queryKey,
      queryFn: () => getAllCategories({ page, size }).then((res) => res.data),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // ----------------------------------------
  //
  // Fetching next page
  //
  // ----------------------------------------
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

  // -------------------------------------------------
  //
  // Add new Category - Websocket
  //
  // -------------------------------------------------
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

  // ---------------------------------------
  //
  // Update Category - Websocket
  //
  // ---------------------------------------
  function updateCategory(updated: Category) {
    setJustUpdateFieldId(updated.category_id);

    queryClient.setQueriesData<GetAllCategoriesResponse>(
      { queryKey: ["category"] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          categories: oldData.categories.map((cat) =>
            cat.category_id === updated.category_id ? updated : cat,
          ),
        };
      },
    );
  }
  useUpdateCategoryWebsocket({ onCategoryUpdate: updateCategory });
  useEffect(() => {
    setTimeout(() => setJustUpdateFieldId(null), 5000);
  }, [justUpdatedFieldId]);

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
