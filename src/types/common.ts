export interface Pagination {
  page: number;
  size: number;
  item_count: number;
  total_pages: number;
  total_items: number;
}

export interface BackendErrorDetail {
  message: string;
  status: number;
  timestamp: string;
  detail: string;
}
