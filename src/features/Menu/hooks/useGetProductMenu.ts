import { useInfiniteQuery } from "@tanstack/react-query";
import type { CategoryType } from "@/features/categories/types/enums";
import { getMenu } from "../services/menu";
import type { ProductMenuResponse } from "@/features/products/types/product";

export function useGetProductMenu({
  size,
  categoryType,
  categoryName,
  keyword,
}: {
  size: number;
  categoryType: CategoryType | "ALL";
  categoryName: string | null;
  keyword: string | null;
}) {
  // Infinite scrolling support
  return useInfiniteQuery<ProductMenuResponse>({
    queryKey: ["product-menu", size, categoryType, categoryName, keyword],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getMenu({
        page: pageParam as number,
        size,
        categoryType,
        categoryName,
        keyword,
      }).then((res) => res.data),

    getNextPageParam: (lastPage) => {
      const current = lastPage.pagination.page;
      const total = lastPage.pagination.total_pages;

      return current < total ? current + 1 : undefined;
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
