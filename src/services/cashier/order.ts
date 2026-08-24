//
//
import type { AxiosResponse } from "axios";
import api from "../../lib/axios";
import type { CreateOrderRequest, GetOrderInfoResponse } from "../../types/order";



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
export async function confirmOrder (orderId: string): Promise<void> {

  return await api.post(`/api/v2/cashier-order/${orderId}/confirm`)
}