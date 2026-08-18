// services/cashier.service.ts

import type { AxiosResponse } from "axios";
import api from "../lib/axios";
import type { CATEGORY_TYPE } from "../types/category";
import type { CreateOrderRequest, GetOrderInfoResponse } from "../types/order";


//
// Get Menu
// Filter
//
export async function getMenu({
  page,
  size,
  categoryType,
  categoryName,
  keyword,
}: {
  page: number;
  size: number;
  categoryType: CATEGORY_TYPE | "ALL";
  categoryName: string | null;
  keyword: string | null;
}) {
  const params: Record<string, string | number> = { page, size };

  if (keyword !== null) {
    params.keyword = keyword;
  }
  if (categoryType !== "ALL") {
    params.category_type = categoryType;
  }
  if (categoryName !== null) {
    params.category_name = categoryName;
  }
  return await api.get("/api/v2/menu-query", { params });
}

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
