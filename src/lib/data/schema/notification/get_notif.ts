export type NotificationCategory = "operational" | "finance" | "system";
export type NotificationTargetRole = "tenant" | "owner" | "supplier" | "all";
export type NotificationVariant =
  | "info"
  | "success"
  | "warning"
  | "destructive";

export interface NotificationItem {
  id: string;
  typeCode: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: NotificationCategory;
  targetRole: NotificationTargetRole;
  variant: NotificationVariant;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}
