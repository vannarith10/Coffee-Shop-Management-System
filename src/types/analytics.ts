import type { BarDatum } from "@nivo/bar";
import type { Range } from "./enums";

export interface TopSellingProductRequest {
  range: Range;
  page: number;
  size: number;
}

export interface BusinessSummaryResponse {
  summary: {
    today_revenue: { value: number; growth_pct: number };
    today_total_orders: { value: number; growth_pct: number };
    today_average_order_value: { value: number; growth_pct: number };
  };
}

export interface BusiestHoursResponse {
  days: {
    id: string;
    data: { x: string; y: number }[];
  }[];
}

export interface RevenueTrendsResponse extends BarDatum {
  day: string;
  revenue: number;
}

export type RevenuTrendsResponse = RevenueTrendsResponse; // Backward compatibility
