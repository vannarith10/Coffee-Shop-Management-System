


import type { StockStatusType } from "@/types";
import api from "../../lib/axios";

//
// Update Stock Status
//
export async function updateStockStatus({
  productId,
  newStatus,
}: {
  productId: string;
  newStatus: StockStatusType;
}): Promise<void> {
  await api.post<void>(
    `/api/v2/product/update/${productId}/stock-status?status=${newStatus}`,
  );
}
