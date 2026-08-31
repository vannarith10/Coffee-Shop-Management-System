


import type { PRODUCT_STOCK_STATUS } from "../../types/product";
import api from "../../lib/axios";

//
// Update Stock Status
//
export async function updateStockStatus({
  productId,
  newStatus,
}: {
  productId: string;
  newStatus: PRODUCT_STOCK_STATUS;
}): Promise<void> {
  await api.post<void>(
    `/api/v2/product/update/${productId}/stock-status?status=${newStatus}`,
  );
}
