import { Role } from "@/types";

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

export const DUMMY_NOTIFICATIONS: Record<Role, NotificationItem[]> = {
  // ── TENANT NOTIFICATIONS ──────────────────────────────────────────────────
  tenant: [
    // --- OPERATIONAL (Halaman /dashboard/tenant/leases atau POS) ---
    {
      id: "t-op-1",
      typeCode: "op_lease_approved",
      title: "Lease Application Approved",
      description:
        "Your application for Kiosk A-12 (Plaza Margonda) has been approved by the owner. Please proceed with payment.",
      time: "10 mins ago",
      read: false,
      category: "operational",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/tenant/leases/lc-001",
    },
    {
      id: "t-op-2",
      typeCode: "op_lease_rejected",
      title: "Lease Application Rejected",
      description:
        "Your rental proposal for Stall C-09 was declined by the owner due to space availability conflicts.",
      time: "2 hours ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "destructive",
      actionUrl: "/dashboard/tenant/leases",
    },
    {
      id: "t-op-3",
      typeCode: "op_lease_started",
      title: "Lease Active & Move-In Ready",
      description:
        "Your lease for Stall B-04 is officially active! You can now move in and start operation.",
      time: "Yesterday",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "info",
      actionUrl: "/dashboard/tenant/leases/lc-002",
    },
    {
      id: "t-op-4",
      typeCode: "op_lease_expiring",
      title: "Lease Ending Soon",
      description:
        "Your lease contract for Kiosk A-12 will end in 14 days. Click here to extend or apply for renewal.",
      time: "2 days ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "warning",
      actionUrl: "/dashboard/tenant/leases/lc-001",
    },
    {
      id: "t-op-5",
      typeCode: "op_inspection_submitted",
      title: "Move-In Inspection Uploaded",
      description:
        "The owner uploaded initial inspection records and photo documentation for Kiosk A-12.",
      time: "3 days ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "info",
      actionUrl: "/dashboard/tenant/leases/lc-001/inspection",
    },
    {
      id: "t-op-6",
      typeCode: "op_damage_claim_opened",
      title: "Damage Claim Filed by Owner",
      description:
        "Owner submitted a claim of Rp 350,000 for electrical fixture damage on lease #LC-881.",
      time: "4 days ago",
      read: false,
      category: "operational",
      targetRole: "tenant",
      variant: "warning",
      actionUrl: "/dashboard/tenant/leases/lc-881/claims",
    },
    {
      id: "t-op-7",
      typeCode: "op_damage_claim_resolved",
      title: "Damage Claim Resolved",
      description:
        "Agreed settlement of Rp 200,000 for claim #DC-102 has been processed against deposit.",
      time: "5 days ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/tenant/leases/lc-881/claims",
    },
    {
      id: "t-op-8",
      typeCode: "op_key_request_updated",
      title: "Spare Key Request Approved",
      description:
        "Your request for a spare duplicate key has been approved by the stall owner.",
      time: "1 week ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "info",
    },
    {
      id: "t-op-9",
      typeCode: "op_b2b_order_shipped",
      title: "Raw Material Order Shipped",
      description:
        "Biteship courier (GoSend Instant) is delivering 50kg Coffee Beans from Supplier Rian Supply Hub.",
      time: "1 hour ago",
      read: false,
      category: "operational",
      targetRole: "tenant",
      variant: "info",
      actionUrl: "/dashboard/business/biz-01/marketplace/orders/sup-9921",
    },
    {
      id: "t-op-10",
      typeCode: "op_b2b_order_delivered",
      title: "B2B Supply Order Delivered",
      description:
        "Order #SUP-9921 has arrived safely at your business stall location.",
      time: "3 hours ago",
      read: true,
      category: "operational",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/business/biz-01/marketplace/orders/sup-9921",
    },

    // --- FINANCE (Halaman /dashboard/wallet/notifications) ---
    {
      id: "t-fin-1",
      typeCode: "finance_rent_due",
      title: "Monthly Rent Payment Due",
      description:
        "Rent payment of Rp 3,500,000 for Kiosk A-12 is due in 3 days to avoid lease suspension.",
      time: "25 mins ago",
      read: false,
      category: "finance",
      targetRole: "tenant",
      variant: "warning",
      actionUrl: "/dashboard/tenant/billing",
    },
    {
      id: "t-fin-2",
      typeCode: "finance_payment_success",
      title: "Rent Payment Verified",
      description:
        "Remittance of Rp 3,500,000 for contract #LC-001 has been verified and held in escrow.",
      time: "3 hours ago",
      read: true,
      category: "finance",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "t-fin-3",
      typeCode: "finance_payment_expired",
      title: "Payment Window Expired",
      description:
        "Lease application #LC-990 was cancelled because the payment window elapsed.",
      time: "1 day ago",
      read: true,
      category: "finance",
      targetRole: "tenant",
      variant: "destructive",
    },
    {
      id: "t-fin-4",
      typeCode: "finance_deposit_refunded",
      title: "Escrow Deposit Refunded",
      description:
        "Security deposit of Rp 1,500,000 for ended contract #LC-771 was fully refunded to your payout method.",
      time: "2 days ago",
      read: true,
      category: "finance",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "t-fin-5",
      typeCode: "finance_deposit_deducted",
      title: "Security Deposit Deducted",
      description:
        "Rp 300,000 was deducted from deposit #LC-881 for unpaid utility arrears as agreed.",
      time: "3 days ago",
      read: true,
      category: "finance",
      targetRole: "tenant",
      variant: "warning",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "t-fin-6",
      typeCode: "finance_anti_spam_warning",
      title: "Commitment Deposit Flag Active",
      description:
        "You have 2 cancelled unpaid applications. Future applications require a 35% commitment deposit.",
      time: "4 days ago",
      read: false,
      category: "finance",
      targetRole: "tenant",
      variant: "destructive",
      actionUrl: "/dashboard/wallet/notifications",
    },
    {
      id: "t-fin-7",
      typeCode: "finance_b2b_order_paid",
      title: "Supplier Payment Settled",
      description:
        "Payment of Rp 1,250,000 for order #SUP-9921 has been settled via Midtrans QRIS.",
      time: "5 hours ago",
      read: true,
      category: "finance",
      targetRole: "tenant",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "t-fin-8",
      typeCode: "finance_subscription_paid",
      title: "Plan Subscription Charged",
      description:
        "Single-Role Tenant PRO plan renewed successfully for Rp 99,000 / month.",
      time: "1 week ago",
      read: true,
      category: "finance",
      targetRole: "all",
      variant: "success",
      actionUrl: "/dashboard/wallet/subscription",
    },

    // --- SYSTEM (Halaman /dashboard/settings/notifications) ---
    {
      id: "t-sys-1",
      typeCode: "sys_subscription_renewed",
      title: "Subscription Active",
      description:
        "Your Tenant PRO feature suite remains active until December 15, 2026.",
      time: "5 hours ago",
      read: false,
      category: "system",
      targetRole: "all",
      variant: "success",
      actionUrl: "/dashboard/wallet/subscription",
    },
    {
      id: "t-sys-2",
      typeCode: "sys_subscription_expiring",
      title: "Subscription Expiring Soon",
      description:
        "Your current platform plan expires in 3 days. Renew now to avoid losing PRO features.",
      time: "1 day ago",
      read: false,
      category: "system",
      targetRole: "all",
      variant: "warning",
      actionUrl: "/dashboard/wallet/subscription",
    },
    {
      id: "t-sys-3",
      typeCode: "sys_security_login_alert",
      title: "New Device Login",
      description:
        "Successful login registered from Chrome on macOS (IP: 180.252.11.2, Medan).",
      time: "2 days ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "warning",
      actionUrl: "/dashboard/settings/password",
    },
    {
      id: "t-sys-4",
      typeCode: "sys_password_changed",
      title: "Password Changed Successfully",
      description:
        "Your account credentials were updated. If this wasn't you, reset immediately.",
      time: "1 week ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "info",
      actionUrl: "/dashboard/settings/password",
    },
    {
      id: "t-sys-5",
      typeCode: "sys_identity_verified",
      title: "KTP Identity Approved",
      description:
        "Your Indonesian National Identity Document (NIK KTP) was verified by admin.",
      time: "2 weeks ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "success",
      actionUrl: "/dashboard/settings/documents",
    },
  ],

  // ── OWNER NOTIFICATIONS ───────────────────────────────────────────────────
  owner: [
    // --- OPERATIONAL ---
    {
      id: "o-op-1",
      typeCode: "op_new_lease_application",
      title: "New Lease Application Received",
      description:
        "Tenant 'Kopi Susu Abadi' submitted an application for Stall Ruko Margonda #02.",
      time: "5 mins ago",
      read: false,
      category: "operational",
      targetRole: "owner",
      variant: "info",
      actionUrl: "/dashboard/owner/applications",
    },
    {
      id: "o-op-2",
      typeCode: "op_lease_ghosting_cancelled",
      title: "Application Cancelled (Ghosting)",
      description:
        "Application #LC-102 was auto-cancelled because the prospective tenant failed to pay within 24 hours.",
      time: "1 hour ago",
      read: true,
      category: "operational",
      targetRole: "owner",
      variant: "warning",
      actionUrl: "/dashboard/owner/applications",
    },
    {
      id: "o-op-3",
      typeCode: "op_tenant_move_in",
      title: "Tenant Move-In Confirmed",
      description:
        "Tenant confirmed key receipt and officially started occupancy at Stall B-04.",
      time: "2 hours ago",
      read: true,
      category: "operational",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/owner/tenancies",
    },
    {
      id: "o-op-4",
      typeCode: "op_tenant_move_out",
      title: "Tenant Move-Out Completed",
      description:
        "Tenant vacated Stall A-01. Listing is now ready for re-publishing.",
      time: "1 day ago",
      read: true,
      category: "operational",
      targetRole: "owner",
      variant: "info",
      actionUrl: "/dashboard/owner/portfolio",
    },
    {
      id: "o-op-5",
      typeCode: "op_inspection_required",
      title: "Move-Out Inspection Required",
      description:
        "Tenant reported lease end. Please upload move-out inspection photo evidence.",
      time: "1 day ago",
      read: false,
      category: "operational",
      targetRole: "owner",
      variant: "warning",
      actionUrl: "/dashboard/owner/tenancies",
    },
    {
      id: "o-op-6",
      typeCode: "op_damage_claim_appealed",
      title: "Tenant Counter-Appealed Claim",
      description:
        "Tenant submitted a counter-note regarding damage claim #DC-102.",
      time: "2 days ago",
      read: false,
      category: "operational",
      targetRole: "owner",
      variant: "warning",
      actionUrl: "/dashboard/owner/tenancies",
    },
    {
      id: "o-op-7",
      typeCode: "op_key_request_created",
      title: "Key Handover Requested",
      description:
        "Tenant requested cylinder lock replacement for Stall Ruko Margonda #02.",
      time: "3 days ago",
      read: true,
      category: "operational",
      targetRole: "owner",
      variant: "info",
    },
    {
      id: "o-op-8",
      typeCode: "op_review_received",
      title: "New Stall Review Posted",
      description:
        "Tenant left a 5-star rating for Stall B-04: 'Great location and fast electricity support!'",
      time: "4 days ago",
      read: true,
      category: "operational",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/owner/portfolio",
    },

    // --- FINANCE ---
    {
      id: "o-fin-1",
      typeCode: "finance_rent_received",
      title: "Rent Remittance Secured in Escrow",
      description:
        "Tenant paid Rp 12,000,000 for 3-month lease. Funds are safely held in Lapakita Escrow.",
      time: "30 mins ago",
      read: false,
      category: "finance",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "o-fin-2",
      typeCode: "finance_payout_success",
      title: "Escrow Payout Disbursed",
      description:
        "Net revenue payout of Rp 11,760,000 was transferred to your Bank BCA account.",
      time: "1 day ago",
      read: true,
      category: "finance",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "o-fin-3",
      typeCode: "finance_payout_failed",
      title: "Payout Transfer Failed",
      description:
        "Payout to Bank Mandiri failed (Account Name Mismatch). Please review payment methods.",
      time: "2 days ago",
      read: false,
      category: "finance",
      targetRole: "owner",
      variant: "destructive",
      actionUrl: "/dashboard/wallet/payment-methods",
    },
    {
      id: "o-fin-4",
      typeCode: "finance_claim_payout_released",
      title: "Damage Claim Payout Released",
      description:
        "Approved claim of Rp 500,000 was disbursed from tenant deposit into your wallet.",
      time: "3 days ago",
      read: true,
      category: "finance",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "o-fin-5",
      typeCode: "finance_deposit_released",
      title: "Deposit Refund Authorized",
      description:
        "Remaining security deposit of Rp 1,000,000 was returned to tenant upon lease completion.",
      time: "4 days ago",
      read: true,
      category: "finance",
      targetRole: "owner",
      variant: "info",
    },

    // --- SYSTEM ---
    {
      id: "o-sys-1",
      typeCode: "sys_profile_updated",
      title: "Property Deed Credentials Verified",
      description:
        "Your ownership documentation for Plaza Margonda was validated by Lapakita Legal Team.",
      time: "4 hours ago",
      read: false,
      category: "system",
      targetRole: "owner",
      variant: "success",
      actionUrl: "/dashboard/settings/documents",
    },
    {
      id: "o-sys-2",
      typeCode: "sys_subscription_paid",
      title: "All-Access Owner Plan Active",
      description:
        "Subscription charged successfully. You have unlimited stall listings available.",
      time: "2 days ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "success",
      actionUrl: "/dashboard/wallet/subscription",
    },
  ],

  // ── SUPPLIER NOTIFICATIONS ────────────────────────────────────────────────
  supplier: [
    // --- OPERATIONAL ---
    {
      id: "s-op-1",
      typeCode: "op_new_b2b_order",
      title: "New B2B Order #SUP-3012",
      description:
        "Tenant 'Kopi Susu Abadi' ordered 20kg Arabica Beans + 50L UHT Milk (Rp 2,450,000).",
      time: "15 mins ago",
      read: false,
      category: "operational",
      targetRole: "supplier",
      variant: "info",
      actionUrl: "/dashboard/supplier/orders/sup-3012",
    },
    {
      id: "s-op-2",
      typeCode: "op_b2b_order_cancelled",
      title: "Order #SUP-2991 Cancelled",
      description:
        "Buyer cancelled order #SUP-2991 prior to pickup allocation.",
      time: "1 hour ago",
      read: true,
      category: "operational",
      targetRole: "supplier",
      variant: "destructive",
      actionUrl: "/dashboard/supplier/orders",
    },
    {
      id: "s-op-3",
      typeCode: "op_shipping_pickup_allocated",
      title: "Biteship Driver Allocated",
      description:
        "Driver GoSend (B 3991 EFX) is en route to pick up packages at Warehouse A.",
      time: "2 hours ago",
      read: true,
      category: "operational",
      targetRole: "supplier",
      variant: "info",
      actionUrl: "/dashboard/supplier/orders/sup-3012",
    },
    {
      id: "s-op-4",
      typeCode: "op_new_regular_subscriber",
      title: "New Regular Buyer Added",
      description:
        "Tenant 'Martabak Bandung 88' added your hub to their Regular Suppliers list.",
      time: "1 day ago",
      read: true,
      category: "operational",
      targetRole: "supplier",
      variant: "success",
      actionUrl: "/dashboard/supplier/subscribers",
    },
    {
      id: "s-op-5",
      typeCode: "op_stock_low_warning",
      title: "Low Stock Alert: UHT Milk 1L",
      description:
        "Inventory item 'Full Cream UHT Milk' has reached minimum threshold (5 units left).",
      time: "5 hours ago",
      read: false,
      category: "operational",
      targetRole: "supplier",
      variant: "warning",
      actionUrl: "/dashboard/supplier/catalog",
    },
    {
      id: "s-op-6",
      typeCode: "op_demand_signal_alert",
      title: "High Demand Signal: Medan District",
      description:
        "Dairy & packaging material demands increased by +45% in your operational city.",
      time: "3 hours ago",
      read: true,
      category: "operational",
      targetRole: "supplier",
      variant: "info",
      actionUrl: "/dashboard/supplier/demand",
    },

    // --- FINANCE ---
    {
      id: "s-fin-1",
      typeCode: "finance_order_payment_cleared",
      title: "Sales Payment Cleared",
      description:
        "Funds of Rp 2,450,000 for order #SUP-3012 cleared to your available payout balance.",
      time: "1 hour ago",
      read: false,
      category: "finance",
      targetRole: "supplier",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },
    {
      id: "s-fin-2",
      typeCode: "finance_payout_success",
      title: "Supplier Revenue Disbursed",
      description:
        "Disbursement of Rp 8,900,000 completed successfully to registered BCA account.",
      time: "2 days ago",
      read: true,
      category: "finance",
      targetRole: "supplier",
      variant: "success",
      actionUrl: "/dashboard/wallet/history",
    },

    // --- SYSTEM ---
    {
      id: "s-sys-1",
      typeCode: "sys_password_changed",
      title: "Account Password Updated",
      description:
        "Your login credentials were modified from registered mobile device.",
      time: "2 days ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "info",
      actionUrl: "/dashboard/settings/password",
    },
    {
      id: "s-sys-2",
      typeCode: "sys_identity_verified",
      title: "Business License Verified",
      description:
        "NIB & Supplier Business permit documents successfully verified by admin.",
      time: "1 week ago",
      read: true,
      category: "system",
      targetRole: "all",
      variant: "success",
      actionUrl: "/dashboard/settings/documents",
    },
  ],
};
