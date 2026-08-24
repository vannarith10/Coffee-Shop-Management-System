//
// types/barista/order.ts
//
import type { Pagination } from "../pagination";


export type RetrieveOrderStatus = "QUEUED" | "PREPARING" | "DONE";


export interface BaristaOrderQueue {
    pagination: Pagination;
    barista_order_items: BaristaOrderItem[];
}



export interface BaristaOrderItem {
    order_id: string;
    order_number: string;
    status: RetrieveOrderStatus;
    note: string;
    create_at: string;
    items: Item[];
}



export interface Item {
    item_id: string;
    name: string;
    image_url: string;
    quantity: string;
}