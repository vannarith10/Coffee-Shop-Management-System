// hooks/useCategoryStatusSummary.ts
// Tanstack

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryStatusSummary } from "../services/admin/category";
import type { CategoryStatusSummaryResponse } from "../types/category";
import { useCategoryStatusUpdate } from "./websockets/useCategoryStatusSummaryUpdate";

export function useCategoryStatusSummary() {
  const queryClient = useQueryClient();
  const queryKey = ["category-status-summary"];

  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<CategoryStatusSummaryResponse>({
      queryKey,
      queryFn: () => getCategoryStatusSummary().then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // ============
  // WebSocket
  // ============
  function handleUpdateCategoryStatus(
    newCategoryStatus: CategoryStatusSummaryResponse,
  ) {
    queryClient.setQueryData(["category-status-summary"], newCategoryStatus);
  }

  useCategoryStatusUpdate({
    onUpdateCategoryStatus: handleUpdateCategoryStatus,
  });

  return {
    statusSummary: data ?? null,
    isLoading,
    isError,
    isRefetching,
    refetch,
  };
}
