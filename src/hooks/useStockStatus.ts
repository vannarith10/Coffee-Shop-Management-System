// hooks/useStockStatus.ts
// Tanstack

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllProductsStatus } from "../services/admin.service";
import { useProductStockStatusUpdate } from "./websockets/useStockStatusWebSocket";
import type { ProductStock, StockStatusResponse } from "../types/product";
import { useEffect } from "react";

export function useStockStatus({ page, size }: { page: number; size: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["productStatus", page, size];

  // Fetch Product Stock
  async function fetchStockStatus() {
    const response = await getAllProductsStatus({ page, size });
    return response.data;
  }

  // 1. Manage API query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: fetchStockStatus,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes (Fresh)
    gcTime: 1000 * 60 * 30, // 30 minutes (Garbage Collection)
  });

  // 2. Fetch next page automatically
  // =======================================
  const product = data as StockStatusResponse | undefined;
  const totalPages = product?.pagination?.total_pages ?? 1;
  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    queryClient.prefetchQuery({
      queryKey: ["productStatus", nextPage, size],
      queryFn: () =>
        getAllProductsStatus({ page: nextPage, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10, // 10 minutes (Fresh)
      gcTime: 1000 * 60 * 30, // 30 minutes (Garbage Collection)
    });
  }, [data, page, totalPages, queryClient, size]);

  // 3. WebSocket
  useProductStockStatusUpdate({
    onStockStatusUpdate: (updatedProduct: ProductStock) => {
      queryClient.setQueryData(queryKey, (oldData: StockStatusResponse) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          products: oldData.products.map((p: ProductStock) =>
            p.id === updatedProduct.id ? updatedProduct : p,
          ),
        };
      });
    },
  });

  return { product: data ?? null, isLoading, isError, refetch };
}
