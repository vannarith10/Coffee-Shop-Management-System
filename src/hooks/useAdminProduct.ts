// hooks/useProduct.ts
// TanStack

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminProductResponse } from "../types/product";
import { getAllProducts } from "../services/admin/product";
import { useEffect } from "react";
import type { CATEGORY_TYPE } from "../types/category";

export function useAdminProduct({
  page,
  size,
  categoryType,
  categoryName,
  keyword,
}: {
  page: number;
  size: number;
  categoryType: CATEGORY_TYPE | "ALL";
  categoryName: string | null;
  keyword: string | null;
}) {

  const queryClient = useQueryClient();
  const queryKey = [
    "product",
    page,
    size,
    categoryType,
    categoryName,
    keyword,
  ];

  // ==========================
  // Fetch data
  // ==========================
  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<AdminProductResponse>({
      queryKey,
      queryFn: () =>
        getAllProducts({
          page,
          size,
          categoryType,
          categoryName,
          keyword,
        }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // =============================
  // Fetch next page
  // =============================
  const totalPages = data?.pagination.total_pages ?? 1;
  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    queryClient.prefetchQuery({
      queryKey: [
        "product",
        nextPage,
        size,
        categoryType,
        categoryName,
        keyword,
      ],
      queryFn: () =>
        getAllProducts({
          page: nextPage,
          size,
          categoryType,
          categoryName,
          keyword
        }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });
  }, [
    data,
    page,
    totalPages,
    size,
    queryClient,
    categoryType,
    categoryName,
    keyword,
  ]);

  return { products: data || null, isLoading, isError, isRefetching, refetch };
}
