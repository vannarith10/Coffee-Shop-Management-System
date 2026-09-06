// hooks/useStockStatus.ts
// Tanstack

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllProductsStatus } from "../services/admin/product";
import { useProductStockStatusUpdate } from "../websocket/stock/useUpdateStockWebSocket";
import type { ProductStock, StockStatusResponse } from "../types/product";
import { useEffect, useState } from "react";

export function useStockStatus({ page, size }: { page: number; size: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["productStatus", page, size];

  const [justUpdatedIds, setJustUpdatedIds] = useState<Set<string>>(new Set());

  const markUpdated = (id: string) => {
    setJustUpdatedIds((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setJustUpdatedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 6000);
  };

  // ---------------------------------------
  //
  // 1. Fetch Data
  //
  // ---------------------------------------
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    isRefetchError,
  } = useQuery<StockStatusResponse>({
    queryKey,
    queryFn: () =>
      getAllProductsStatus({ page, size }).then(
        (res) => res.data as StockStatusResponse,
      ),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes (Fresh)
    gcTime: 1000 * 60 * 30, // 30 minutes (Garbage Collection)
  });

  // ---------------------------------------
  //
  // 2. Fetch next page automatically
  //
  // ---------------------------------------
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

  // ---------------------------------------
  //
  // 3. Update stock - WebSocket
  //
  // ---------------------------------------
  useProductStockStatusUpdate({
    onStockStatusUpdate: (updatedProduct: ProductStock) => {
      markUpdated(updatedProduct.id);

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

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    isRefetchError,
    justUpdatedIds,
  };
}
