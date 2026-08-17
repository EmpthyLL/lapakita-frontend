export interface LegalSubsection {
  title?: string;
  body: string;
}

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  subsections: LegalSubsection[];
}

export type SlugKey = "terms" | "privacy" | "cookies";

export interface LegalDocument {
  slug: SlugKey;
  label: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "terms",
    label: "Terms & Conditions",
    title: "Terms and Conditions",
    intro:
      "These terms govern your use of Lapakita as a Tenant, Stall Owner, or Supplier. Please read them carefully before using the platform.",
    sections: [
      {
        id: "platform-nature",
        number: "1",
        title: "Introduction & Platform Nature",
        subsections: [
          {
            body: "Lapakita is an online venue and operating platform connecting Tenants (Business Operators), Stall Owners, and B2B Suppliers. Lapakita is not a real estate broker, property manager, cleaner, law enforcement agent, or direct seller of products. Lapakita provides digital infrastructure, contract tools, escrow payment facilitation, and business analytics.",
          },
        ],
      },
      {
        id: "user-roles",
        number: "2",
        title: "User Roles & Single Account Multi-Persona",
        subsections: [
          {
            body: "A user registers a single primary account verified by email and phone number. A single account may operate across three personas (Tenant, Stall Owner, Supplier). Users are responsible for all activities under their credentials.",
          },
        ],
      },
      {
        id: "leasing-contracts",
        number: "3",
        title: "Stall Leasing, Contracts & Payment Timelines",
        subsections: [
          {
            title: "Digital Lease Agreement & Owner Configurations",
            body: "Stall Owners configure specific lease rules for their listings, including Start Date options (1st, 15th, End of Month, or custom dates between 1-28), Minimum Lease Durations, and Payment Cycles (Monthly, Quarterly, Semesterly, Yearly). Tenants use search filters to find stalls matching their preferred timeline.",
          },
          {
            title: "Approval Lock & Payment Deadline",
            body: "Upon Owner approval, the stall is temporarily locked and removed from public search. The Tenant must complete the initial rent and security deposit payment via the Payment Gateway on or before the selected Start Date.",
          },
          {
            title: "Ghosting Penalty & Contract Cancellation",
            body: "If a Tenant fails to complete payment by the Start Date deadline, the Owner holds the right to immediately cancel the contract and issue a 1-star public review for breach of commitment.",
          },
          {
            title: "Refundable Anti-Spam Commitment Fee",
            body: "To protect Owners from application spam, Tenants with two (2) or more unpaid or cancelled approved applications within a 30-day window are flagged. Flagged Tenants are required to submit a temporary 35% commitment deposit when applying. This deposit is 100% REFUNDABLE and non-punitive: if the lease becomes active, 100% of the deposit is applied directly toward the Tenant's initial rent and security deposit balance. If the application is cancelled or fails to proceed before the Start Date, the commitment deposit is fully refunded back to the Tenant's account. Account flag status and public star ratings remain the primary disciplinary measures for non-completion.",
          },
        ],
      },
      {
        id: "escrow",
        number: "4",
        title: "Security Deposit & Escrow Handling",
        subsections: [
          {
            title: "Escrow Storage",
            body: "Security deposits are collected via a licensed Payment Gateway Escrow and held neutrally during the lease term. Deposits do not reside in the Owner's personal bank account during active tenancy.",
          },
          {
            title: "Usage Scope",
            body: "Security deposits exist strictly as a guarantee against physical property damage or lost key reproduction, not as daily punitive fines.",
          },
          {
            title: "Damage Claim & Appeal Process",
            body: "Upon tenant exit, the Owner may submit a damage claim with itemized costs and timestamped photo evidence. The Tenant has a designated window to Accept or Appeal the claim. If Accepted, funds are disbursed to the Owner's payout bank account, and the remainder is returned to the Tenant's registered bank account. If Appealed, Lapakita Platform Support acts as a neutral administrative reviewer to inspect initial vs. final photo records and make a final binding deposit adjustment.",
          },
          {
            title: "Deposit Limits & Major Property Damage",
            body: "The Security Deposit set by the Owner represents the maximum escrow guarantee recoverable directly through the platform. Lapakita is not liable for repair costs exceeding the deposited amount. In cases of severe property destruction or vandalism exceeding the deposit, Lapakita will disburse 100% of the available deposit to the Owner and provide verified KYC evidence to assist the Owner in formal legal proceedings. The offending Tenant's account will be permanently blacklisted.",
          },
        ],
      },
      {
        id: "keys-access",
        number: "5",
        title: "Physical Keys, Duplication & Lock Cylinder Responsibility",
        subsections: [
          {
            title: "Initial Key Handover",
            body: "Keys are handed over directly from the Owner to the Tenant at the start of the lease.",
          },
          {
            title: "Key Returns & Exit (Freedom of Return)",
            body: "Returning physical keys upon lease termination is optional. Tenants are not penalized solely for unreturned keys, nor are they required to return duplicated sets.",
          },
          {
            title: "Key Duplication",
            body: "Tenants are free to duplicate keys independently at local locksmiths at their own expense during the lease term.",
          },
          {
            title: "Owner Security Recommendation (Lock Cylinder Hygiene)",
            body: "Lapakita strongly urges Stall Owners to replace the lock cylinder/knob set between different tenancies. If an Owner chooses to reuse an old lock set with spare keys, the Owner accepts all inherent security risks regarding potential duplicate keys. Lapakita bears no liability for property security breaches resulting from reused locks.",
          },
          {
            title: "Lost Key Protocol — Owner Has a Spare Key",
            body: "If the Tenant loses their keys but the Owner has a master or spare key, the Tenant pays strictly for the key duplication fee, which can be deducted from the security deposit or paid directly to the Owner.",
          },
          {
            title: "Lost Key Protocol — Total Key Loss",
            body: "If all keys are lost and a locksmith must pick the lock, forge a new key from scratch, or replace the entire lock cylinder: the Owner is responsible for managing the lock replacement process and covering any structural/lock cylinder hardware costs, as the underlying asset owner. The Tenant pays only for the cost of the individual key(s) created for them, as penalty for their negligence.",
          },
        ],
      },
      {
        id: "utilities-electricity",
        number: "6",
        title: "Utilities, Electricity & Operational Expenses",
        subsections: [
          {
            title: "Owner Provision",
            body: "Stall Owners are responsible for providing basic operational utility infrastructure, including electrical power capacity (kVA), water meters, or plumbing connections as advertised in the listing.",
          },
          {
            title: "Tenant Usage & Billing Responsibility",
            body: "Ongoing consumption of electricity, water, internet, trash disposal, or local market maintenance fees during the active lease term is the sole responsibility of the Tenant. Tenants must top up prepaid electricity tokens (PLN) or pay monthly utility bills directly.",
          },
          {
            title: "Utility Arrears Upon Exit",
            body: "If a Tenant vacates a stall with unpaid post-paid utility bills or unpaid local maintenance fees, the Owner is entitled to deduct the exact outstanding arrears amount from the Tenant's escrow security deposit upon exit.",
          },
        ],
      },
      {
        id: "cleanliness-eviction",
        number: "7",
        title: "Stall Cleanliness, Abandoned Items & Evictions",
        subsections: [
          {
            title: "Cleanliness Duty",
            body: "Tenants are fully responsible for removing all personal items and inventory upon exit. Owners are responsible for presenting a clean space to incoming tenants.",
          },
          {
            title: "Manual Listing Reactivation",
            body: "Active or pending stalls are automatically hidden from the marketplace. Upon a tenant's exit or contract cancellation, the stall does NOT automatically reappear. It is the Owner's sole responsibility to manually reactivate/publish the listing once the physical space is clean and ready for new viewings.",
          },
          {
            title: "Abandoned Goods",
            body: "Items left behind by an evicted or departed tenant after lease termination may be disposed of, kept, or cleared by the Stall Owner at their sole discretion. Lapakita bears no liability for abandoned property.",
          },
        ],
      },
      {
        id: "supplier-disputes",
        number: "8",
        title: "Supplier Marketplace & B2B Disputes",
        subsections: [
          {
            title: "Peer-to-Peer Transactions",
            body: "The B2B Supplier Marketplace connects Tenants directly with Suppliers.",
          },
          {
            title: "Dispute Handling",
            body: "Lapakita does not provide manual admin arbitration for supplier product complaints (e.g. wrong ingredients, delayed deliveries, minor stock defects). Buyers and Suppliers must resolve issues via direct chat. Buyers retain full rights to leave public star ratings and reviews on product catalogs and supplier profiles.",
          },
        ],
      },
      {
        id: "payouts",
        number: "9",
        title: "Payouts & Bank Account Requirements",
        subsections: [
          {
            body: "Owners and Suppliers must register a valid bank account for automated payout disbursements. Tenants must register a valid bank account to receive potential deposit refunds.",
          },
        ],
      },
    ],
  },

  {
    slug: "privacy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    intro:
      "This policy explains what data Lapakita collects, how it's used, and the protections in place across Tenant, Owner, and Supplier accounts.",
    sections: [
      {
        id: "data-collected",
        number: "1",
        title: "Data We Collect",
        subsections: [
          {
            title: "Account Identity",
            body: "Full name, email address, phone number (WhatsApp), and encrypted password.",
          },
          {
            title: "Verification Data (KYC)",
            body: "ID card (KTP) photo, OCR data, and a selfie with KTP — collected prior to lease signing or supplier activation for legal identity binding.",
          },
          {
            title: "Financial & Payout Data",
            body: "Bank account name, bank name, and account number for automated payment routing via payment gateway APIs.",
          },
          {
            title: "Operational & Transactional Data",
            body: "POS sales entries, stock levels, item prices, rental payment history, chat messages, uploaded property photos, and review ratings.",
          },
        ],
      },
      {
        id: "data-usage",
        number: "2",
        title: "How We Use Your Data",
        subsections: [
          {
            body: "To facilitate digital lease contracts, billing, and automated payout transfers.",
          },
          {
            body: "To display B2B supplier catalogs to relevant tenant business categories.",
          },
          {
            body: "To generate aggregated, non-personally identifiable Business Intelligence (BI) statistics — e.g. area demand trends, average foot traffic scores.",
          },
          {
            body: "To verify identity in cases of legal lease disputes or deposit appeals.",
          },
        ],
      },
      {
        id: "data-protection",
        number: "3",
        title: "Data Protection & Non-Disclosure",
        subsections: [
          {
            title: "No Data Selling",
            body: "Lapakita strictly never sells, rents, or trades user personal data, business revenues, or private transaction logs to third-party advertisers or data brokers.",
          },
          {
            title: "Privacy of Revenue Data",
            body: "Individual tenant revenue figures and POS ledgers are strictly private to the tenant's business account. Stall Owners cannot view a tenant's exact gross revenue or profit margins.",
          },
          {
            title: "Secure Infrastructure",
            body: "All sensitive payload data, API tokens, and credentials are encrypted using industry-standard protocols (TLS/SSL) and stored securely.",
          },
        ],
      },
      {
        id: "data-retention",
        number: "4",
        title: "Data Retention & User Rights",
        subsections: [
          {
            body: "Users may request account deactivation and data erasure, provided there are no active binding lease contracts, pending escrow deposit claims, or unfulfilled B2B transactions associated with the account.",
          },
        ],
      },
    ],
  },

  {
    slug: "cookies",
    label: "Cookies Policy",
    title: "Cookies & Local Storage Policy",
    intro:
      "Lapakita uses minimal browser storage — strictly for essential functionality, never for invasive tracking or ad retargeting.",
    sections: [
      {
        id: "what-we-store",
        number: "1",
        title: "What We Store",
        subsections: [
          {
            title: "Session State",
            body: "Keeping you logged in securely across page reloads.",
          },
          {
            title: "Active Role Preference",
            body: "Remembering whether you last operated in Tenant, Owner, or Supplier mode.",
          },
          {
            title: "POS Cache",
            body: "Temporarily caching POS cart items and product lists locally so your cashier interface remains fast and responsive even during minor network drops.",
          },
        ],
      },
      {
        id: "third-party-cookies",
        number: "2",
        title: "Third-Party Cookies",
        subsections: [
          {
            body: "We do not use invasive third-party tracking cookies, cross-site behavioral tracking scripts, or ad-retargeting pixels. Third-party scripts are strictly limited to secure Payment Gateway iFrames (Midtrans/Xendit) for payment processing.",
          },
        ],
      },
    ],
  },
];
