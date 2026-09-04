//util/role.ts

import { type Role } from "../types/role";

export const isAdmin = (role?: Role) => role === "ADMIN"

export const isCashier = (role?: Role) => role === "CASHIER"

export const isBarista = (role?: Role) => role === "BARISTA"