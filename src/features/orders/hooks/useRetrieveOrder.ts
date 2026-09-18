import { useInfiniteQuery } from "@tanstack/react-query";
import type { RetrieveOrderStatus } from "../types/order";
import type { BaristaOrderQueue } from "../types/order";
import type { BackendErrorDetailType } from "@/types/common";
import { getOrders } from "../services/order";

interface OrderQueueRequest {
  size: number;
  status: RetrieveOrderStatus | null;
}

export function useRetrieveOrder({ size, status }: OrderQueueRequest) {
  return useInfiniteQuery<BaristaOrderQueue, BackendErrorDetailType>({
    queryKey: ["barista-order", size, status],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getOrders(pageParam as number, size, status).then((res) => res.data),

    getNextPageParam: (lastPage) => {
      const curr = lastPage.pagination.page;
      const next = curr + 1;
      const total = lastPage.pagination.total_pages;
      return curr < total ? next : undefined;
    },

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
  });
}

// Usage:

// {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     refetch,
//   }
