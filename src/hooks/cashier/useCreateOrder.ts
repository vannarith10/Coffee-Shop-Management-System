//hooks/cashier/useCreateOrder.ts

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../../types/error";
import {
  type CreateCashOrderResponse,
  type CreateOrderRequest,
} from "../../types/order";
import { createCashOrder } from "../../services/cashier.service";
import { toast } from "sonner";


export function useCreateOrder() {
  return useMutation<
    CreateCashOrderResponse,
    AxiosError<BackendErrorDetail>,
    CreateOrderRequest
  >({
    mutationFn: (request: CreateOrderRequest) =>
      createCashOrder(request).then((res) => res.data),


    onError: (error) => {
      toast.error(
        error.response?.data?.detail ?? "Failed to make an order",
        { duration: 3000 },
      );
    },
  });
}
