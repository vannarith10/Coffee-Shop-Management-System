import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../../types/error";
import type { PRODUCT_STOCK_STATUS } from "../../types/product";
import { updateStockStatus } from "../../services/admin/stock";

type Request = {
  productId: string;
  newStatus: PRODUCT_STOCK_STATUS;
};

export function useUpdateStockStatus() {
  return useMutation<void, AxiosError<BackendErrorDetail>, Request>({
    mutationFn: (Request) => updateStockStatus(Request),
  });
}
