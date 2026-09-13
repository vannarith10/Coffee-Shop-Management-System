//util/role.ts

import { ROLES, type RoleType } from "@/types";

export const isAdmin = (role?: RoleType) => role === ROLES.ADMIN;

export const isCashier = (role?: RoleType) => role === ROLES.CASHIER;

export const isBarista = (role?: RoleType) => role === ROLES.BARISTA;
