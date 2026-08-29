// ----------------------------------------------------------------
//
// Name only
//
// Get all names for user when they update or create a new product,
// so that they can see their category names
// how many categories they have
//
// ----------------------------------------------------------------

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllCategoryNames } from "../services/admin/category";

interface NameTypeResponse {
  category_id: string;
  category_name: string;
  category_type: string;
}

export function useGetAllCategoryNames() {
  const queryKey = ["all-category-names"];

  const { data, isLoading, isError, isRefetching, refetch } = useQuery<NameTypeResponse[]>({
    queryKey,
    queryFn: () => getAllCategoryNames().then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
  });

  return {
    categoryNameType: data ?? null,
    isLoadingCategoryNames: isLoading,
    isErrorCategoryNames: isError,
    isRefetchingCategoryNames: isRefetching,
    refetchCategoryName: refetch,
  };
}
