import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTopSellingProduct } from "../../products/services/product";
import type { TopSellingResponse } from "@/features/products/types/product";
import type { AxiosError } from "axios";
import { type BackendErrorDetailType } from "../../../types/common";
import { type RangeType } from "../types/enums";
import { toast } from "sonner";
import { useEffect } from "react";

export function useTopSellingProduct({
  page,
  size,
  range,
}: {
  page: number;
  size: number;
  range: RangeType;
}) {
  const queryKey = ["top-selling-products", range, page, size];

  // -----------------------------------------
  //
  // 1. Fetch Data | Query
  //
  // -----------------------------------------
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    TopSellingResponse,
    AxiosError<BackendErrorDetailType>
  >({
    queryKey,
    queryFn: () =>
      getTopSellingProduct({ range, page, size }).then(
        (res) => res.data as TopSellingResponse,
      ),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const errorDetail = error?.response?.data ?? null;
  useEffect(() => {
    if (errorDetail?.message) {
      toast.error(errorDetail.message);
    }
  }, [errorDetail]);

  return {
    topSelling: data ?? null,
    isLoading,
    isError,
    refetch,
    isRefetching,
  };
}
