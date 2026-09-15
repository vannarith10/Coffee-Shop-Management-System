import z from "zod";
import { passwordSchema } from "@/validation";
import { ROLES, SCHEDULES, SHIFT, STATUS } from "@/types";

// ----------------------------------------------
//
// Create Staff
//
// ----------------------------------------------
export const createStaffSchema = z
  .object({
    full_name: z.string().min(2, "Name is required").trim(),
    username: z
      .string()
      .min(2, "Username must be at least 3 charecters")
      .trim(),

    password: passwordSchema,
    confirmPassword: passwordSchema,

    schedules: z
      .array(z.enum(SCHEDULES))
      .min(1, "Select at least one schedule"),

    role: z.enum(ROLES, { message: "Please select a role" }),
    shift: z.enum(SHIFT, { message: "Please select a shift" }),
    status: z.enum(STATUS, { message: "Please select a status" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

// ----------------------------------------------
//
// Edit Staff
//
// ----------------------------------------------
export const editStaffSchema = z.object({
  name: z.string().max(30, "Name allowed only 30 charecters").nullable(),
  username: z
    .string()
    .max(30, "Username allowed only 30 charecters")
    .nullable(),
  email: z.email().nullable(),
  password: z.union([z.literal(""), passwordSchema, z.null()]),
  confirmPassword: z.union([z.literal(""), passwordSchema, z.null()]),
  schedules: z.array(z.enum(SCHEDULES)).nullable(),
  role: z.enum(ROLES).nullable(),
  shift: z.enum(SHIFT).nullable(),
  status: z.enum(STATUS).nullable(),
});
