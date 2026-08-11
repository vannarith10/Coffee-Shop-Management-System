// hooks/cashier/useGetOrderInfo

import { useQuery } from "@tanstack/react-query";
import { getOrderInfo } from "../../services/cashier.service";
import type { GetOrderInfoResponse } from "../../types/order";
import type { BackendErrorDetail } from "../../types/error";
import type { AxiosError } from "axios";


export function useGetOrderInfo(orderId: string) {

  return useQuery<GetOrderInfoResponse, AxiosError<BackendErrorDetail>>({
    queryKey: ["Get-Order-Info", orderId],
    queryFn: () => getOrderInfo(orderId).then((res) => res.data),

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}

// Usage: {data, error, isLoading, isError, isRefetching, refetch,...}