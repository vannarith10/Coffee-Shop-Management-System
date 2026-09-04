// types/role.ts
//

export enum Role {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  BARISTA = "BARISTA",
  STAFF = "STAFF",
}

// export type Role = "ADMIN" | "CASHIER" | "BARISTA" | "STAFF";

// Used for map() or other purposes | Now I just ues it for mapping displaying on UI
export const ROLES: Role[] = [
  Role.ADMIN,
  Role.CASHIER,
  Role.BARISTA,
  Role.STAFF,
];
