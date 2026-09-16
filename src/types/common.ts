import z from "zod";

// -------------------------------------------------------------
//
// Pagination schema for validating API responses
//
// -------------------------------------------------------------
export const paginationSchema = z.object({
  page: z.number().positive(), // greater than 0
  size: z.number().positive(),
  item_count: z.number().nonnegative(), // can be 0
  total_pages: z.number().nonnegative(),
  total_items: z.number().nonnegative(),
});

export type PaginationType = z.infer<typeof paginationSchema>;

// -------------------------------------------------------------
//
// BackendErrorDetail schema for validating API error responses
//
// -------------------------------------------------------------
export const backendErrorDetailSchema = z.object({
  message: z.string(),
  status: z.number().int(),
  timestamp: z.string().datetime(),
  detail: z.string().optional(),
});

export type BackendErrorDetailType = z.infer<typeof backendErrorDetailSchema>;
