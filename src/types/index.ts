export const ROLE_VALUES = ["tenant", "owner", "supplier"] as const;

export type Role = (typeof ROLE_VALUES)[number];

export type RoleAndAll = Role | "all";

export const VALID_ROLES: Role[] = [...ROLE_VALUES];

export const ROLES_CONFIG: Record<
  RoleAndAll,
  {
    label: string;
    colorClass: string;
    bgSoftClass: string;
    borderClass: string;
  }
> = {
  all: {
    label: "General Mode",
    colorClass: "bg-muted-foreground text-background",
    bgSoftClass: "bg-secondary text-foreground",
    borderClass: "border-border hover:border-foreground/40",
  },
  tenant: {
    label: "Tenant",
    colorClass: "bg-tenant text-tenant-foreground",
    bgSoftClass: "bg-tenant/10 text-tenant",
    borderClass: "border-tenant/30 hover:border-tenant",
  },
  owner: {
    label: "Stall Owner",
    colorClass: "bg-owner text-owner-foreground",
    bgSoftClass: "bg-owner/10 text-owner",
    borderClass: "border-owner/30 hover:border-owner",
  },
  supplier: {
    label: "Supplier",
    colorClass: "bg-supplier text-supplier-foreground",
    bgSoftClass: "bg-supplier/10 text-supplier",
    borderClass: "border-supplier/30 hover:border-supplier",
  },
};
