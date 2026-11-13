import { RoleAndAll } from "@/types";

export type NotificationCategory = "operational" | "finance" | "system";
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
  read: boolean;
  category: NotificationCategory;
  targetRole: RoleAndAll;
  variant: NotificationVariant;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Helper untuk generate waktu acak lampau secara statis
const now = new Date();
const getRandomDate = (seedOffset: number) => {
  const pastMinutes = (seedOffset * 43 + 17) % (10 * 24 * 60); // acak dalam 10 hari terakhir
  return new Date(now.getTime() - pastMinutes * 60 * 1000).toISOString();
};

export const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  // ===========================================================================
  // 1. OPERATIONAL: TENANT
  // ===========================================================================
  {
    id: "t-op-1",
    typeCode: "op_lease_approved",
    title: "Lease Application Approved",
    description:
      "Your application for Kiosk A-12 (Plaza Margonda) has been approved by the owner. Please proceed with payment.",
    read: false,
    category: "operational",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/tenant/leases/lc-001",
    createdAt: getRandomDate(1),
  },
  {
    id: "t-op-2",
    typeCode: "op_lease_rejected",
    title: "Lease Application Rejected",
    description:
      "Your rental proposal for Stall C-09 was declined by the owner due to space availability conflicts.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "destructive",
    actionUrl: "/dashboard/tenant/leases",
    createdAt: getRandomDate(2),
  },
  {
    id: "t-op-3",
    typeCode: "op_lease_started",
    title: "Lease Active & Move-In Ready",
    description:
      "Your lease for Stall B-04 is officially active! You can now move in and start operation.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "info",
    actionUrl: "/dashboard/tenant/leases/lc-002",
    createdAt: getRandomDate(3),
  },
  {
    id: "t-op-4",
    typeCode: "op_lease_expiring",
    title: "Lease Ending Soon",
    description:
      "Your lease contract for Kiosk A-12 will end in 14 days. Click here to extend or apply for renewal.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "warning",
    actionUrl: "/dashboard/tenant/leases/lc-001",
    createdAt: getRandomDate(4),
  },
  {
    id: "t-op-5",
    typeCode: "op_inspection_submitted",
    title: "Move-In Inspection Uploaded",
    description:
      "The owner uploaded initial inspection records and photo documentation for Kiosk A-12.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "info",
    actionUrl: "/dashboard/tenant/leases/lc-001/inspection",
    createdAt: getRandomDate(5),
  },
  {
    id: "t-op-6",
    typeCode: "op_damage_claim_opened",
    title: "Damage Claim Filed by Owner",
    description:
      "Owner submitted a claim of Rp 350,000 for electrical fixture damage on lease #LC-881.",
    read: false,
    category: "operational",
    targetRole: "tenant",
    variant: "warning",
    actionUrl: "/dashboard/tenant/leases/lc-881/claims",
    createdAt: getRandomDate(6),
  },
  {
    id: "t-op-7",
    typeCode: "op_damage_claim_resolved",
    title: "Damage Claim Resolved",
    description:
      "Agreed settlement of Rp 200,000 for claim #DC-102 has been processed against deposit.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/tenant/leases/lc-881/claims",
    createdAt: getRandomDate(7),
  },
  {
    id: "t-op-8",
    typeCode: "op_key_request_updated",
    title: "Spare Key Request Approved",
    description:
      "Your request for a spare duplicate key has been approved by the stall owner.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "info",
    createdAt: getRandomDate(8),
  },
  {
    id: "t-op-9",
    typeCode: "op_b2b_order_shipped",
    title: "Raw Material Order Shipped",
    description:
      "Biteship courier (GoSend Instant) is delivering 50kg Coffee Beans from Rian Supply Hub.",
    read: false,
    category: "operational",
    targetRole: "tenant",
    variant: "info",
    actionUrl: "/dashboard/business/biz-01/marketplace/orders/sup-9921",
    createdAt: getRandomDate(9),
  },
  {
    id: "t-op-10",
    typeCode: "op_b2b_order_delivered",
    title: "B2B Supply Order Delivered",
    description:
      "Order #SUP-9921 has arrived safely at your business stall location.",
    read: true,
    category: "operational",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/business/biz-01/marketplace/orders/sup-9921",
    createdAt: getRandomDate(10),
  },

  // ===========================================================================
  // 2. OPERATIONAL: OWNER
  // ===========================================================================
  {
    id: "o-op-1",
    typeCode: "op_new_lease_application",
    title: "New Lease Application Received",
    description:
      "Tenant 'Kopi Susu Abadi' submitted an application for Stall Ruko Margonda #02.",
    read: false,
    category: "operational",
    targetRole: "owner",
    variant: "info",
    actionUrl: "/dashboard/owner/applications",
    createdAt: getRandomDate(11),
  },
  {
    id: "o-op-2",
    typeCode: "op_lease_ghosting_cancelled",
    title: "Application Cancelled (Ghosting)",
    description:
      "Application #LC-102 was auto-cancelled because the prospective tenant failed to pay within 24 hours.",
    read: true,
    category: "operational",
    targetRole: "owner",
    variant: "warning",
    actionUrl: "/dashboard/owner/applications",
    createdAt: getRandomDate(12),
  },
  {
    id: "o-op-3",
    typeCode: "op_tenant_move_in",
    title: "Tenant Move-In Confirmed",
    description:
      "Tenant confirmed key receipt and officially started occupancy at Stall B-04.",
    read: true,
    category: "operational",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/owner/tenancies",
    createdAt: getRandomDate(13),
  },
  {
    id: "o-op-4",
    typeCode: "op_tenant_move_out",
    title: "Tenant Move-Out Completed",
    description:
      "Tenant vacated Stall A-01. Listing is now ready for re-publishing.",
    read: true,
    category: "operational",
    targetRole: "owner",
    variant: "info",
    actionUrl: "/dashboard/owner/portfolio",
    createdAt: getRandomDate(14),
  },
  {
    id: "o-op-5",
    typeCode: "op_inspection_required",
    title: "Move-Out Inspection Required",
    description:
      "Tenant reported lease end. Please upload move-out inspection photo evidence.",
    read: false,
    category: "operational",
    targetRole: "owner",
    variant: "warning",
    actionUrl: "/dashboard/owner/tenancies",
    createdAt: getRandomDate(15),
  },
  {
    id: "o-op-6",
    typeCode: "op_damage_claim_appealed",
    title: "Tenant Counter-Appealed Claim",
    description:
      "Tenant submitted a counter-note regarding damage claim #DC-102.",
    read: false,
    category: "operational",
    targetRole: "owner",
    variant: "warning",
    actionUrl: "/dashboard/owner/tenancies",
    createdAt: getRandomDate(16),
  },
  {
    id: "o-op-7",
    typeCode: "op_key_request_created",
    title: "Key Handover Requested",
    description:
      "Tenant requested cylinder lock replacement for Stall Ruko Margonda #02.",
    read: true,
    category: "operational",
    targetRole: "owner",
    variant: "info",
    createdAt: getRandomDate(17),
  },
  {
    id: "o-op-8",
    typeCode: "op_review_received",
    title: "New Stall Review Posted",
    description:
      "Tenant left a 5-star rating for Stall B-04: 'Great location and fast electricity support!'",
    read: true,
    category: "operational",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/owner/portfolio",
    createdAt: getRandomDate(18),
  },

  // ===========================================================================
  // 3. OPERATIONAL: SUPPLIER
  // ===========================================================================
  {
    id: "s-op-1",
    typeCode: "op_new_b2b_order",
    title: "New B2B Order #SUP-3012",
    description:
      "Tenant 'Kopi Susu Abadi' ordered 20kg Arabica Beans + 50L UHT Milk (Rp 2,450,000).",
    read: false,
    category: "operational",
    targetRole: "supplier",
    variant: "info",
    actionUrl: "/dashboard/supplier/orders/sup-3012",
    createdAt: getRandomDate(19),
  },
  {
    id: "s-op-2",
    typeCode: "op_b2b_order_cancelled",
    title: "Order #SUP-2991 Cancelled",
    description: "Buyer cancelled order #SUP-2991 prior to pickup allocation.",
    read: true,
    category: "operational",
    targetRole: "supplier",
    variant: "destructive",
    actionUrl: "/dashboard/supplier/orders",
    createdAt: getRandomDate(20),
  },
  {
    id: "s-op-3",
    typeCode: "op_shipping_pickup_allocated",
    title: "Biteship Driver Allocated",
    description:
      "Driver GoSend (B 3991 EFX) is en route to pick up packages at Warehouse A.",
    read: true,
    category: "operational",
    targetRole: "supplier",
    variant: "info",
    actionUrl: "/dashboard/supplier/orders/sup-3012",
    createdAt: getRandomDate(21),
  },
  {
    id: "s-op-4",
    typeCode: "op_new_regular_subscriber",
    title: "New Regular Buyer Added",
    description:
      "Tenant 'Martabak Bandung 88' added your hub to their Regular Suppliers list.",
    read: true,
    category: "operational",
    targetRole: "supplier",
    variant: "success",
    actionUrl: "/dashboard/supplier/subscribers",
    createdAt: getRandomDate(22),
  },
  {
    id: "s-op-5",
    typeCode: "op_stock_low_warning",
    title: "Low Stock Alert: UHT Milk 1L",
    description:
      "Inventory item 'Full Cream UHT Milk' has reached minimum threshold (5 units left).",
    read: false,
    category: "operational",
    targetRole: "supplier",
    variant: "warning",
    actionUrl: "/dashboard/supplier/catalog",
    createdAt: getRandomDate(23),
  },
  {
    id: "s-op-6",
    typeCode: "op_demand_signal_alert",
    title: "High Demand Signal: Medan District",
    description:
      "Dairy & packaging material demands increased by +45% in your operational city.",
    read: true,
    category: "operational",
    targetRole: "supplier",
    variant: "info",
    actionUrl: "/dashboard/supplier/demand",
    createdAt: getRandomDate(24),
  },

  // ===========================================================================
  // 4. OPERATIONAL: ALL ROLES (BROADCAST / CROSS-ROLE)
  // ===========================================================================
  {
    id: "all-op-1",
    typeCode: "op_platform_holiday_schedule",
    title: "National Holiday Logistics Notice",
    description:
      "Instant and same-day courier allocations may experience slight delays during public holidays.",
    read: true,
    category: "operational",
    targetRole: "all",
    variant: "info",
    createdAt: getRandomDate(25),
  },

  // ===========================================================================
  // 5. FINANCE: ALL / ACCOUNT-WIDE (SUBSCRIPTION & PLATFORM FEES)
  // ===========================================================================
  {
    id: "all-fin-1",
    typeCode: "finance_subscription_paid",
    title: "All-Access Plan Payment Settled",
    description:
      "Payment of Rp 249,000 for All-Access Multi-Role Subscription has been settled via BCA Virtual Account.",
    read: false,
    category: "finance",
    targetRole: "all",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 249000, invoiceId: "INV-SUB-202611-01" },
    createdAt: getRandomDate(26),
  },
  {
    id: "all-fin-2",
    typeCode: "finance_subscription_failed",
    title: "Auto-Renewal Charge Failed",
    description:
      "Failed to process subscription renewal of Rp 249,000. Please update your primary payment method.",
    read: false,
    category: "finance",
    targetRole: "all",
    variant: "destructive",
    actionUrl: "/dashboard/wallet/payment-methods",
    metadata: { amount: 249000 },
    createdAt: getRandomDate(27),
  },
  {
    id: "all-fin-3",
    typeCode: "finance_invoice_generated",
    title: "Monthly Platform Tax Invoice Ready",
    description:
      "Your consolidated monthly billing and e-Faktur statement for October 2026 is ready to download.",
    read: true,
    category: "finance",
    targetRole: "all",
    variant: "info",
    actionUrl: "/dashboard/wallet/history",
    createdAt: getRandomDate(28),
  },

  // ===========================================================================
  // 6. FINANCE: TENANT
  // ===========================================================================
  {
    id: "t-fin-1",
    typeCode: "finance_rent_due",
    title: "Monthly Rent Payment Due",
    description:
      "Rent payment of Rp 3,500,000 for Kiosk A-12 is due in 3 days to avoid lease suspension.",
    read: false,
    category: "finance",
    targetRole: "tenant",
    variant: "warning",
    actionUrl: "/dashboard/tenant/leases/lc-001",
    metadata: { amount: 3500000, contractId: "lc-001" },
    createdAt: getRandomDate(29),
  },
  {
    id: "t-fin-2",
    typeCode: "finance_payment_success",
    title: "Rent Payment Verified",
    description:
      "Remittance of Rp 3,500,000 for contract #LC-001 has been verified and held in escrow.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 3500000 },
    createdAt: getRandomDate(30),
  },
  {
    id: "t-fin-3",
    typeCode: "finance_payment_expired",
    title: "Payment Window Expired",
    description:
      "Lease application #LC-990 was cancelled because the 24-hour payment window elapsed.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "destructive",
    createdAt: getRandomDate(31),
  },
  {
    id: "t-fin-4",
    typeCode: "finance_deposit_refunded",
    title: "Escrow Deposit Refunded",
    description:
      "Security deposit of Rp 1,500,000 for ended contract #LC-771 was fully refunded to your Bank BCA account.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 1500000 },
    createdAt: getRandomDate(32),
  },
  {
    id: "t-fin-5",
    typeCode: "finance_deposit_deducted",
    title: "Security Deposit Deducted",
    description:
      "Rp 300,000 was deducted from deposit #LC-881 for unpaid utility arrears as agreed.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "warning",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 300000 },
    createdAt: getRandomDate(33),
  },
  {
    id: "t-fin-6",
    typeCode: "finance_anti_spam_warning",
    title: "Commitment Deposit Flag Active (35%)",
    description:
      "You have 2 cancelled unpaid applications. Future applications require a 35% refundable commitment deposit.",
    read: false,
    category: "finance",
    targetRole: "tenant",
    variant: "destructive",
    actionUrl: "/dashboard/wallet/notifications",
    createdAt: getRandomDate(34),
  },
  {
    id: "t-fin-7",
    typeCode: "finance_b2b_order_paid",
    title: "B2B Supplier Payment Settled",
    description:
      "Payment of Rp 1,250,000 for order #SUP-9921 has been settled via Midtrans QRIS.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 1250000 },
    createdAt: getRandomDate(35),
  },
  {
    id: "t-fin-8",
    typeCode: "finance_commitment_deposit_refunded",
    title: "35% Commitment Deposit Returned",
    description:
      "Your commitment deposit of Rp 1,225,000 has been credited back following lease activation.",
    read: true,
    category: "finance",
    targetRole: "tenant",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 1225000 },
    createdAt: getRandomDate(36),
  },

  // ===========================================================================
  // 7. FINANCE: OWNER
  // ===========================================================================
  {
    id: "o-fin-1",
    typeCode: "finance_rent_received",
    title: "Rent Remittance Secured in Escrow",
    description:
      "Tenant paid Rp 12,000,000 for 3-month lease at Stall Ruko Margonda #02. Funds are held safely.",
    read: false,
    category: "finance",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 12000000 },
    createdAt: getRandomDate(37),
  },
  {
    id: "o-fin-2",
    typeCode: "finance_payout_success",
    title: "Rental Payout Disbursed",
    description:
      "Net revenue payout of Rp 11,760,000 was transferred to your Bank BCA account (****8821).",
    read: true,
    category: "finance",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 11760000 },
    createdAt: getRandomDate(38),
  },
  {
    id: "o-fin-3",
    typeCode: "finance_payout_failed",
    title: "Payout Transfer Failed",
    description:
      "Payout of Rp 4,500,000 to Bank Mandiri failed (Account Name Mismatch). Please verify your payout account.",
    read: false,
    category: "finance",
    targetRole: "owner",
    variant: "destructive",
    actionUrl: "/dashboard/wallet/payment-methods",
    metadata: { amount: 4500000 },
    createdAt: getRandomDate(39),
  },
  {
    id: "o-fin-4",
    typeCode: "finance_claim_payout_released",
    title: "Damage Claim Settlement Disbursed",
    description:
      "Approved claim of Rp 500,000 was transferred from tenant deposit into your registered payout method.",
    read: true,
    category: "finance",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 500000 },
    createdAt: getRandomDate(40),
  },
  {
    id: "o-fin-5",
    typeCode: "finance_deposit_released",
    title: "Tenant Deposit Refund Completed",
    description:
      "Remaining security deposit of Rp 1,000,000 was returned to tenant upon clean move-out inspection.",
    read: true,
    category: "finance",
    targetRole: "owner",
    variant: "info",
    metadata: { amount: 1000000 },
    createdAt: getRandomDate(41),
  },
  {
    id: "o-fin-6",
    typeCode: "finance_key_fee_received",
    title: "Replacement Key Fee Credited",
    description:
      "Tenant paid Rp 150,000 for lost key cylinder replacement on contract #LC-402.",
    read: true,
    category: "finance",
    targetRole: "owner",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 150000 },
    createdAt: getRandomDate(42),
  },

  // ===========================================================================
  // 8. FINANCE: SUPPLIER
  // ===========================================================================
  {
    id: "s-fin-1",
    typeCode: "finance_order_payment_cleared",
    title: "B2B Order Payment Cleared",
    description:
      "Funds of Rp 2,450,000 for order #SUP-3012 cleared after buyer delivery confirmation.",
    read: false,
    category: "finance",
    targetRole: "supplier",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 2450000 },
    createdAt: getRandomDate(43),
  },
  {
    id: "s-fin-2",
    typeCode: "finance_payout_success",
    title: "Supplier Revenue Disbursed",
    description:
      "Disbursement of Rp 8,900,000 completed successfully to your GoPay Merchant / BCA account.",
    read: true,
    category: "finance",
    targetRole: "supplier",
    variant: "success",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 8900000 },
    createdAt: getRandomDate(44),
  },
  {
    id: "s-fin-3",
    typeCode: "finance_payout_failed",
    title: "E-Wallet Disbursement Limit Exceeded",
    description:
      "Payout of Rp 12,000,000 to OVO failed due to monthly e-wallet incoming limit. Switch to Bank Transfer.",
    read: false,
    category: "finance",
    targetRole: "supplier",
    variant: "destructive",
    actionUrl: "/dashboard/wallet/payment-methods",
    metadata: { amount: 12000000 },
    createdAt: getRandomDate(45),
  },
  {
    id: "s-fin-4",
    typeCode: "finance_order_refund_processed",
    title: "Cancelled Order Refunded to Buyer",
    description:
      "Order #SUP-2991 (Rp 650,000) was cancelled before pickup and refunded to the tenant.",
    read: true,
    category: "finance",
    targetRole: "supplier",
    variant: "warning",
    actionUrl: "/dashboard/wallet/history",
    metadata: { amount: 650000 },
    createdAt: getRandomDate(46),
  },

  // ===========================================================================
  // 9. SYSTEM: ACCOUNT, SUBSCRIPTION LIFECYCLE & SECURITY (SETTINGS)
  // ===========================================================================
  {
    id: "sys-1",
    typeCode: "sys_subscription_renewed",
    title: "All-Access Subscription Active",
    description:
      "Your All-Access multi-role plan is active until December 15, 2026 across Tenant, Owner, and Supplier.",
    read: false,
    category: "system",
    targetRole: "all",
    variant: "success",
    actionUrl: "/dashboard/wallet/subscription",
    createdAt: getRandomDate(47),
  },
  {
    id: "sys-2",
    typeCode: "sys_subscription_expiring",
    title: "Subscription Expiring in 3 Days",
    description:
      "Your platform plan expires on November 16, 2026. Ensure your payment method is active to avoid downgrade.",
    read: false,
    category: "system",
    targetRole: "all",
    variant: "warning",
    actionUrl: "/dashboard/wallet/subscription",
    createdAt: getRandomDate(48),
  },
  {
    id: "sys-3",
    typeCode: "sys_subscription_downgraded",
    title: "Plan Downgraded to Free Tier",
    description:
      "Your single-role subscription expired. Premium analytics and multi-listing slots are temporarily paused.",
    read: true,
    category: "system",
    targetRole: "owner",
    variant: "destructive",
    actionUrl: "/dashboard/wallet/subscription",
    createdAt: getRandomDate(49),
  },
  {
    id: "sys-4",
    typeCode: "sys_security_login_alert",
    title: "New Device Sign-In Detected",
    description:
      "Successful login from Chrome on macOS (Location: Medan, Indonesia). Review if unfamiliar.",
    read: true,
    category: "system",
    targetRole: "all",
    variant: "warning",
    actionUrl: "/dashboard/settings/password",
    createdAt: getRandomDate(50),
  },
  {
    id: "sys-5",
    typeCode: "sys_password_changed",
    title: "Account Password Updated",
    description: "Your account login password was changed successfully.",
    read: true,
    category: "system",
    targetRole: "all",
    variant: "info",
    actionUrl: "/dashboard/settings/password",
    createdAt: getRandomDate(51),
  },
  {
    id: "sys-6",
    typeCode: "sys_identity_verified",
    title: "Legal Identity (KTP) Verified",
    description:
      "Your Indonesian National ID (NIK) has been verified. You can now sign digital lease contracts.",
    read: true,
    category: "system",
    targetRole: "all",
    variant: "success",
    actionUrl: "/dashboard/settings/documents",
    createdAt: getRandomDate(52),
  },
  {
    id: "sys-7",
    typeCode: "sys_supplier_verified",
    title: "Supplier Hub Verification Approved",
    description:
      "Your NIB and supplier profile have been verified. Your catalog is now live on the B2B Marketplace.",
    read: true,
    category: "system",
    targetRole: "supplier",
    variant: "success",
    actionUrl: "/dashboard/supplier/profile",
    createdAt: getRandomDate(53),
  },
];
