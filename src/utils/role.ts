//util/role.ts

import { Role } from "../types/auth";

export const isAdmin = (role?: Role) => role === Role.ADMIN;

export const isCashier = (role?: Role) => role === Role.CASHIER;

export const isBarista = (role?: Role) => role === Role.BARISTA;