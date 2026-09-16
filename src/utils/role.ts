import { ROLES, type RoleType } from "../features/staff/types/enums";

export const isAdmin = (role?: RoleType) => role === ROLES.ADMIN;

export const isCashier = (role?: RoleType) => role === ROLES.CASHIER;

export const isBarista = (role?: RoleType) => role === ROLES.BARISTA;
