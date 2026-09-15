import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "@/types";
import type { StockStatusType } from "@/types";
import { updateStockStatus } from "../../services/admin/stock";

type Request = {
  productId: string;
  newStatus: StockStatusType;
};

export function useUpdateStockStatus() {
  return useMutation<void, AxiosError<BackendErrorDetail>, Request>({
    mutationFn: (Request) => updateStockStatus(Request),
  });
}
