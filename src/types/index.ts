export const ROLE_VALUES = ["venture", "owner", "supplier"] as const;

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
  venture: {
    label: "Venture",
    colorClass: "bg-venture text-venture-foreground",
    bgSoftClass: "bg-venture/10 text-venture",
    borderClass: "border-venture/30 hover:border-venture",
  },
  owner: {
    label: "Owner",
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
