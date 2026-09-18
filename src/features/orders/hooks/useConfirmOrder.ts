import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types/common";
import { confirmOrder } from "../services/order";

export function useConfirmOrder() {
  return useMutation<void, AxiosError<BackendErrorDetailType>, string>({
    mutationFn: (orderId: string) => confirmOrder(orderId),
  });
}
