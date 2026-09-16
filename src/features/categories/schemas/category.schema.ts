import { CATEGORY } from "../types/enums";
import z from "zod";

// ----------------------------------------------
//
// Create Category
//
// ----------------------------------------------
export const createCategorySchema = z.object({
  type: z.enum(CATEGORY, { message: "Please select category type" }),
  name: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, { message: "Please provide category name" })
    .max(20, {
      message: "Category name should be less than or equal to 20 characters",
    }),
  is_active: z.boolean({ message: "Please select status" }),
});
