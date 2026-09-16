import type { PaginationType } from "@/types";
import type { OrderStatusType, PaymentMethodType } from "./enums";

// --------------------------------
// General Order Types
// --------------------------------
export interface Item {
  productId: string;
  quantity: number;
  customization: string | null;
}

export interface CreateOrderRequest {
  note: string | null;
  items: Item[];
}

export interface CreateCashOrderResponse {
  order_id: string;
  order_number: string;
  status: OrderStatusType;
  total_amount: number;
  note: string | null;
  payment_method: PaymentMethodType;
}

export interface GetOrderInfoResponse {
  order_id: string;
  order_number: string;
  payment_method: PaymentMethodType;
  order_status: OrderStatusType;
  total_price: number;
  total_items: number;
  total_units: number;
}

// --------------------------------
// Barista Order Types
// --------------------------------
export type RetrieveOrderStatus = "QUEUED" | "PREPARING" | "DONE" | "CANCELLED";

// Renamed from 'Item' to avoid collision with the general Order 'Item' above
export interface BaristaOrderItemDetail {
  item_id: string;
  name: string;
  image_url: string;
  quantity: string; // Kept as string per original spec
}

export interface BaristaOrderItem {
  order_id: string;
  order_number: string;
  status: RetrieveOrderStatus;
  note: string;
  create_at: string;
  items: BaristaOrderItemDetail[];
}

export interface BaristaOrderQueue {
  pagination: PaginationType;
  barista_order_items: BaristaOrderItem[];
}
