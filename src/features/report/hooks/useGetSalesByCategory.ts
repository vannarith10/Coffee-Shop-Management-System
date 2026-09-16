import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getSalesByCategory } from "@/features/categories/services/category";
import type { GetSalesByCategoryResponse } from "@/features/categories/types/category";
import { RANGE_ARRAY } from "@/features/analytic/types/enums";
import { type RangeType } from "@/features/analytic/types/enums";
import { useEffect } from "react";

export function useGetSalesByCategory({ range }: { range: RangeType }) {
  const queryClient = useQueryClient();
  const queryKey = ["sales-by-category", range];

  const { data, isLoading, isError, isRefetching, refetch } = useQuery<
    GetSalesByCategoryResponse[]
  >({
    queryKey,
    queryFn: () => getSalesByCategory({ range: range }).then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
  });

  // Automatically fetching other range type
  useEffect(() => {
    RANGE_ARRAY.forEach((r) => {
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
