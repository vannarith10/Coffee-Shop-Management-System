import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types/common";
import type { RetrieveOrderStatus } from "../types/order";
import { updateOrderStatus } from "../services/order";

interface UpdateStatusRequest {
  id: string;
  status: RetrieveOrderStatus;
}

export function useUpdateOrderStatus() {
  return useMutation<
    void,
    AxiosError<BackendErrorDetailType>,
    UpdateStatusRequest
  >({
    mutationFn: ({ id, status }) =>
      updateOrderStatus({ id: id, status: status }),
  });
}
