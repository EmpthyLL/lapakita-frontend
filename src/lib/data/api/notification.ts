import { Role } from "@/types";
import { NotificationItem } from "../schema/notification/get_notif";

// ── DATA NOTIFIKASI LENGKAP TERPISAH PER KATEGORI ───────────────────────────
export const DUMMY_NOTIFICATIONS: Record<Role, NotificationItem[]> = {
  tenant: [
    // Operational (Hanya muncul di dashboard tenant)
    {
      id: "t-op-1",
      typeCode: "op_lease_approved",
      title: "Lease Approved",
      description:
        "Your rental application for Kiosk A-12 was approved by the owner.",
      time: "10 min ago",
      read: false,
      category: "operational",
      variant: "success",
    },
    {
      id: "t-op-2",
      typeCode: "op_b2b_order_shipped",
      title: "Supply Order Shipped",
      description:
        "Courier has picked up your raw material order from supplier.",
      time: "1 hr ago",
      read: true,
      category: "operational",
      variant: "info",
    },
    {
      id: "t-op-3",
      typeCode: "op_inspection_submitted",
      title: "Move-in Inspection Uploaded",
      description:
        "The stall owner has uploaded initial inspection documentation.",
      time: "Yesterday",
      read: true,
      category: "operational",
      variant: "info",
    },
    {
      id: "t-op-4",
      typeCode: "op_lease_expiring",
      title: "Lease Expiring Soon",
      description: "Your lease period for Kiosk A-12 will end in 14 days.",
      time: "2 days ago",
      read: true,
      category: "operational",
      variant: "warning",
    },
    // Finance (Hanya muncul di wallet)
    {
      id: "t-fin-1",
      typeCode: "finance_rent_due",
      title: "Monthly Rent Due",
      description:
        "Your upcoming rent payment for Kiosk A-12 is due in 3 days.",
      time: "25 min ago",
      read: false,
      category: "finance",
      variant: "warning",
    },
    {
      id: "t-fin-2",
      typeCode: "finance_payment_success",
      title: "Rent Payment Verified",
      description:
        "Your remittance for monthly lease has been successfully processed.",
      time: "3 hrs ago",
      read: true,
      category: "finance",
      variant: "success",
    },
    {
      id: "t-fin-3",
      typeCode: "finance_deposit_refunded",
      title: "Escrow Deposit Refunded",
      description:
        "Initial security deposit has been fully returned to your wallet.",
      time: "1 day ago",
      read: true,
      category: "finance",
      variant: "success",
    },
    // System (Hanya muncul di settings)
    {
      id: "t-sys-1",
      typeCode: "sys_subscription_renewed",
      title: "Subscription Renewed",
      description:
        "Your All-Access PRO plan subscription was successfully renewed.",
      time: "5 hrs ago",
      read: false,
      category: "system",
      variant: "success",
    },
    {
      id: "t-sys-2",
      typeCode: "sys_security_login_alert",
      title: "New Device Login",
      description:
        "A secure login was registered from a macOS device in Medan.",
      time: "2 days ago",
      read: true,
      category: "system",
      variant: "warning",
    },
  ],
  owner: [
    // Operational (Hanya muncul di dashboard owner)
    {
      id: "o-op-1",
      typeCode: "op_new_lease_application",
      title: "New Lease Application",
      description:
        "A prospective tenant submitted an application for Kiosk B-05.",
      time: "5 min ago",
      read: false,
      category: "operational",
      variant: "success",
    },
    {
      id: "o-op-2",
      typeCode: "op_tenant_move_in",
      title: "Tenant Move-In Confirmed",
      description: "Tenant acknowledged key handover and started occupancy.",
      time: "2 hrs ago",
      read: true,
      category: "operational",
      variant: "info",
    },
    {
      id: "o-op-3",
      typeCode: "op_inspection_required",
      title: "Inspection Required",
      description: "Scheduled move-out inspection needs your verification.",
      time: "1 day ago",
      read: false,
      category: "operational",
      variant: "warning",
    },
    // Finance (Hanya muncul di wallet)
    {
      id: "o-fin-1",
      typeCode: "finance_rent_received",
      title: "Rent Secured in Escrow",
      description:
        "Tenant rental remittance has been verified and secured safely.",
      time: "30 min ago",
      read: false,
      category: "finance",
      variant: "success",
    },
    {
      id: "o-fin-2",
      typeCode: "finance_payout_success",
      title: "Payout Transfer Completed",
      description:
        "Rental payout revenue has been disbursed to your bank account.",
      time: "1 day ago",
      read: true,
      category: "finance",
      variant: "success",
    },
    // System (Hanya muncul di settings)
    {
      id: "o-sys-1",
      typeCode: "sys_profile_updated",
      title: "Legal Documents Verified",
      description:
        "Your ownership credentials and property deeds have been approved.",
      time: "4 hrs ago",
      read: false,
      category: "system",
      variant: "success",
    },
    {
      id: "o-sys-2",
      typeCode: "sys_password_changed",
      title: "Password Updated",
      description: "Your account sign-in password was changed successfully.",
      time: "3 days ago",
      read: true,
      category: "system",
      variant: "info",
    },
  ],
  supplier: [
    // Operational (Hanya muncul di dashboard supplier)
    {
      id: "s-op-1",
      typeCode: "op_new_b2b_order",
      title: "New B2B Supply Order",
      description: "Kiosk A-12 placed an order for grocery inventory items.",
      time: "15 min ago",
      read: false,
      category: "operational",
      variant: "success",
    },
    {
      id: "s-op-2",
      typeCode: "op_demand_signal_alert",
      title: "High Demand Signal (PRO)",
      description:
        "Cooking oil and rice demands are surging in your operating district.",
      time: "3 hrs ago",
      read: true,
      category: "operational",
      variant: "info",
    },
    {
      id: "s-op-3",
      typeCode: "op_stock_low_warning",
      title: "Low Stock Warning",
      description: "Inventory items in your catalog are running low on stock.",
      time: "5 hrs ago",
      read: false,
      category: "operational",
      variant: "warning",
    },
    // Finance (Hanya muncul di wallet)
    {
      id: "s-fin-1",
      typeCode: "finance_order_payment_cleared",
      title: "Order Payment Cleared",
      description:
        "Funds for supply order #9928 have cleared to your balances.",
      time: "1 hr ago",
      read: false,
      category: "finance",
      variant: "success",
    },
    {
      id: "s-fin-2",
      typeCode: "finance_payout_success",
      title: "Supplier Payout Success",
      description: "Sales revenue successfully transferred to registered bank.",
      time: "2 days ago",
      read: true,
      category: "finance",
      variant: "success",
    },
    // System (Hanya muncul di settings)
    {
      id: "s-sys-1",
      typeCode: "sys_password_changed",
      title: "Password Updated",
      description: "Your account sign-in password was changed successfully.",
      time: "2 days ago",
      read: true,
      category: "system",
      variant: "info",
    },
  ],
};
