import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSalesByCategory } from "../services/admin/category";
import type { GetSalesByCategoryResponse } from "../types/category";
import { RANGES, type Range } from "../types/business-analytics";
import { useEffect } from "react";

export function useGetSalesByCategory({ range }: { range: Range }) {
  const queryClient = useQueryClient();
  const queryKey = ["sales-by-category", range];

  const { data, isLoading, isError, isRefetching, refetch } = useQuery<
    GetSalesByCategoryResponse[]
  >({
    queryKey,
    queryFn: () => getSalesByCategory({ range: range }).then((res) => res.data),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    RANGES.forEach((r) => {
      const queryKey = ["sales-by-category", r];

      if (!queryClient.getQueryData(queryKey)) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () =>
            getSalesByCategory({ range: r }).then((res) => res.data),
          staleTime: 1000 * 60,
          gcTime: 1000 * 60 * 30,
        });
      }
    });
  }, [queryClient]);

  return { data, isLoading, isError, isRefetching, refetch };
}
