// hooks/cashier/useConfirmOrder.ts

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../../types/error";
import { confirmOrder } from "../../services/cashier.service";


export function useConfirmOrder() {
  return useMutation<void, AxiosError<BackendErrorDetail>, string>({
    mutationFn: (orderId: string) => confirmOrder(orderId),
  });
}
