type NotificationCategory = "operational" | "finance" | "system";

export interface NotificationItem {
  id: string;
  typeCode: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: NotificationCategory;
  variant: "info" | "success" | "warning" | "destructive";
}
