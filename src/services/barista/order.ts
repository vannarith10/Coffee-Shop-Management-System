import api from "../../lib/axios";
import type { RetrieveOrderStatus } from "../../types/barista/order";

export async function getOrders(
  page: number,
  size: number,
  status: RetrieveOrderStatus | null,
) {
  const params: Record<string, string | number> = { page, size };

  if (status) {
    params.status = status;
  }

  return await api.get(`/api/v2/barista-order/retrieve`, { params });
}


// Update order status
// Queued -> Preparing -> Done
export async function updateOrderStatus({
  id,
  status,
}: {
  id: string;
  status: RetrieveOrderStatus;
}): Promise<void> {
  return await api.put(`/api/v2/barista-order/${id}/update-status`, {
    status: status,
  });
}
