import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type BackendErrorDetailType } from "../../../types/common";
import type { StockStatusType } from "../types/stock";
import { updateStockStatus } from "../services/stock";

type Request = {
  productId: string;
  newStatus: StockStatusType;
};

export function useUpdateStockStatus() {
  return useMutation<void, AxiosError<BackendErrorDetailType>, Request>({
    mutationFn: (Request) => updateStockStatus(Request),
  });
}
