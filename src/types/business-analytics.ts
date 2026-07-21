// types/business-analytics.ts
//

import type { BarDatum } from "@nivo/bar";

// Single source of truth
export const RANGES = [
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "THIS_YEAR",
  "ALL",
] as const;

// Derived type
export type Range = (typeof RANGES)[number];

export interface TopSellingProductRequest {
  range: Range;
  page: number;
  size: number;
}

export interface BusinessSummaryResponse {
  summary: {
    today_revenue: {
      value: number;
      growth_pct: number;
    };
    today_total_orders: {
      value: number;
      growth_pct: number;
    };
    today_average_order_value: {
      value: number;
      growth_pct: number;
    };
  };
}

export interface BusiestHoursResponse {
  days: {
    id: string;
    data: { x: string; y: number }[];
  }[];
}


export interface RevenuTrendsResponse extends BarDatum {
  day: string,
  revenue: number;
}
