export type Role = "tenant" | "owner" | "supplier";

export type RoleAndAll = Role | "all";

export const VALID_ROLES: Role[] = ["tenant", "owner", "supplier"];

export type VariantColor = "primary" | "owner" | "supplier";
