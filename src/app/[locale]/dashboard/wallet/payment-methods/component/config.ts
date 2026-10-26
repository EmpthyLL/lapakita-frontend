export interface PayoutProviderOption {
  code: string;
  name: string;
  type: "bank_account" | "e_wallet";
  logoUrl: string;
}

const logo = (code: string) => `/img/payout/${code}.svg`;

export const PAYOUT_PROVIDERS: {
  banks: PayoutProviderOption[];
  eWallets: PayoutProviderOption[];
} = {
  banks: [
    {
      code: "bca",
      name: "Bank Central Asia (BCA)",
      type: "bank_account",
      logoUrl: logo("bca"),
    },
    {
      code: "mandiri",
      name: "Bank Mandiri",
      type: "bank_account",
      logoUrl: logo("mandiri"),
    },
    {
      code: "bri",
      name: "Bank Rakyat Indonesia (BRI)",
      type: "bank_account",
      logoUrl: logo("bri"),
    },
    {
      code: "bni",
      name: "Bank Negara Indonesia (BNI)",
      type: "bank_account",
      logoUrl: logo("bni"),
    },
    {
      code: "cimb",
      name: "CIMB Niaga",
      type: "bank_account",
      logoUrl: logo("cimb"),
    },
    {
      code: "permata",
      name: "Bank Permata",
      type: "bank_account",
      logoUrl: logo("permata"),
    },
    {
      code: "bsi",
      name: "Bank Syariah Indonesia (BSI)",
      type: "bank_account",
      logoUrl: logo("bsi"),
    },
    {
      code: "jago",
      name: "Bank Jago",
      type: "bank_account",
      logoUrl: logo("jago"),
    },
    {
      code: "seabank",
      name: "SeaBank Indonesia",
      type: "bank_account",
      logoUrl: logo("seabank"),
    },
  ],
  eWallets: [
    {
      code: "gopay",
      name: "GoPay",
      type: "e_wallet",
      logoUrl: logo("gopay"),
    },
    {
      code: "ovo",
      name: "OVO",
      type: "e_wallet",
      logoUrl: logo("ovo"),
    },
    {
      code: "dana",
      name: "DANA",
      type: "e_wallet",
      logoUrl: logo("dana"),
    },
    {
      code: "shopeepay",
      name: "ShopeePay",
      type: "e_wallet",
      logoUrl: logo("shopeepay"),
    },
    {
      code: "linkaja",
      name: "LinkAja",
      type: "e_wallet",
      logoUrl: logo("linkaja"),
    },
  ],
};

export const formatPayoutType = (type: string) => {
  switch (type) {
    case "bank_account":
      return "Bank Account";
    case "e_wallet":
      return "E-Wallet";
    default:
      return type;
  }
};
