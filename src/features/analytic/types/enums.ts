// ----------------------------------------------
//
// Analytics
//
// ----------------------------------------------
export const RANGE = {
  TODAY: "TODAY",
  THIS_WEEK: "THIS_WEEK",
  THIS_MONTH: "THIS_MONTH",
  THIS_YEAR: "THIS_YEAR",
  ALL: "ALL",
} as const;
export const RANGE_ARRAY = Object.values(RANGE);
export type RangeType = (typeof RANGE_ARRAY)[number];