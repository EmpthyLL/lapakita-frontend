export interface PayoutProviderOption {
  value: string; // untuk value autocomplete (code)
  label: string; // nama bank / e-wallet
  code: string;
  name: string;
  type: "bank_account" | "e_wallet";
  icon: string; // logoUrl untuk Autocomplete
}

const logo = (code: string) => `/img/payout/${code}.svg`;

export const PAYOUT_PROVIDERS: {
  banks: PayoutProviderOption[];
  eWallets: PayoutProviderOption[];
} = {
  banks: [
    {
      value: "bca",
      label: "Bank Central Asia (BCA)",
      code: "bca",
      name: "Bank Central Asia (BCA)",
      type: "bank_account",
      icon: logo("bca"),
    },
    {
      value: "mandiri",
      label: "Bank Mandiri",
      code: "mandiri",
      name: "Bank Mandiri",
      type: "bank_account",
      icon: logo("mandiri"),
    },
    {
      value: "bri",
      label: "Bank Rakyat Indonesia (BRI)",
      code: "bri",
      name: "Bank Rakyat Indonesia (BRI)",
      type: "bank_account",
      icon: logo("bri"),
    },
    {
      value: "bni",
      label: "Bank Negara Indonesia (BNI)",
      code: "bni",
      name: "Bank Negara Indonesia (BNI)",
      type: "bank_account",
      icon: logo("bni"),
    },
    {
      value: "cimb",
      label: "CIMB Niaga",
      code: "cimb",
      name: "CIMB Niaga",
      type: "bank_account",
      icon: logo("cimb"),
    },
    {
      value: "permata",
      label: "Bank Permata",
      code: "permata",
      name: "Bank Permata",
      type: "bank_account",
      icon: logo("permata"),
    },
    {
      value: "bsi",
      label: "Bank Syariah Indonesia (BSI)",
      code: "bsi",
      name: "Bank Syariah Indonesia (BSI)",
      type: "bank_account",
      icon: logo("bsi"),
    },
    {
      value: "jago",
      label: "Bank Jago",
      code: "jago",
      name: "Bank Jago",
      type: "bank_account",
      icon: logo("jago"),
    },
    {
      value: "seabank",
      label: "SeaBank Indonesia",
      code: "seabank",
      name: "SeaBank Indonesia",
      type: "bank_account",
      icon: logo("seabank"),
    },
  ],
  eWallets: [
    {
      value: "gopay",
      label: "GoPay",
      code: "gopay",
      name: "GoPay",
      type: "e_wallet",
      icon: logo("gopay"),
    },
    {
      value: "ovo",
      label: "OVO",
      code: "ovo",
      name: "OVO",
      type: "e_wallet",
      icon: logo("ovo"),
    },
    {
      value: "dana",
      label: "DANA",
      code: "dana",
      name: "DANA",
      type: "e_wallet",
      icon: logo("dana"),
    },
    {
      value: "shopeepay",
      label: "ShopeePay",
      code: "shopeepay",
      name: "ShopeePay",
      type: "e_wallet",
      icon: logo("shopeepay"),
    },
    {
      value: "linkaja",
      label: "LinkAja",
      code: "linkaja",
      name: "LinkAja",
      type: "e_wallet",
      icon: logo("linkaja"),
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
