import api from "../../../lib/axios";
import type { RetrieveOrderStatus } from "../types/order"; 
import type { GetOrderInfoResponse } from "../types/order";
import { type CreateOrderRequest } from "../types/order";
import { type AxiosResponse } from "axios";

//
// Create cash order
//
export async function createCashOrder(request: CreateOrderRequest) {
  return await api.post(`/api/v2/cashier-order/create-cash-order`, request);
}

//
// Get Created Order
//
export async function getOrderInfo(
  orderId: string,
): Promise<AxiosResponse<GetOrderInfoResponse>> {
  return await api.get(`/api/v2/cashier-order/created/${orderId}`);
}

//
// Confirm Order & Send to Barista
//
export async function confirmOrder(orderId: string): Promise<void> {
  return await api.post(`/api/v2/cashier-order/${orderId}/confirm`);
}

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
