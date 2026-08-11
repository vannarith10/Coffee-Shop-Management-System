// types/order.ts


export type OrderStatus = 
    "CREATED" |
    "QUEUED" |
    "PREPARING" |
    "DONE" |
    "PAYMENT_PENDING" |
    "CANCELLED" ;

export type PaymentMethod = "CASH" | "QR";


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
    status: OrderStatus;
    total_amount: number;
    note: string | null;
    payment_method: PaymentMethod;
}


export interface GetOrderInfoResponse {
  order_id: string;
  order_number: string;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  total_price: number;
  total_items: number;
  total_units: number;
}
