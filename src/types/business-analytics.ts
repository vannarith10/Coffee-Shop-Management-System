// types/business-analytics.ts
//

// Single source of truth
export const RANGES = ["TODAY", "THIS_WEEK", "THIS_MONTH", "THIS_YEAR", "ALL"] as const;

// Derived type
export type Range = typeof RANGES[number];


export interface TopSellingProductRequest {
    range: Range,
    page: number,
    size: number
}

