import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types";
import type { CreateCashOrderResponse } from "../types/order";
import type { CreateOrderRequest } from "../types/order";
import { createCashOrder } from "../services/order";
import { toast } from "sonner";

export function useCreateOrder() {
  return useMutation<
    CreateCashOrderResponse,
    AxiosError<BackendErrorDetailType>,
    CreateOrderRequest
  >({
    mutationFn: (request: CreateOrderRequest) =>
      createCashOrder(request).then((res) => res.data),

    onError: (error) => {
      toast.error(error.response?.data?.detail ?? "Failed to make an order", {
        duration: 3000,
      });
    },
  });
}
