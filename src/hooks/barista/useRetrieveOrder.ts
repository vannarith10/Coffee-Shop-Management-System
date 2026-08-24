//
// hooks/barista/useRetrieveOrder.ts
//
import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  BaristaOrderQueue,
  RetrieveOrderStatus,
} from "../../types/barista/order";
import type { BackendErrorDetail } from "../../types/error";
import { getOrders } from "../../services/barista/order";

interface OrderQueueRequest {
  size: number;
  status: RetrieveOrderStatus | null;
}

export function useRetrieveOrder({size, status}:OrderQueueRequest) {

  return useInfiniteQuery<BaristaOrderQueue, BackendErrorDetail>({
    queryKey: ["barista-order", size, status],

    initialPageParam: 1,

    queryFn: ({ pageParam }) => getOrders(
        pageParam as number,
        size,
        status
    ).then((res) => res.data),

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