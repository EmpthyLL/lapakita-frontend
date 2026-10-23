export interface PayoutProviderOption {
  code: string;
  name: string;
  type: "bank_account" | "e_wallet";
  logoUrl: string;
}

// Logo dari paket npm `idn-finlogos` (SVG), dipin ke versi 2.3.0 supaya URL stabil.
const LOGO_CDN = "https://cdn.jsdelivr.net/npm/idn-finlogos@2.3.0/dist/icons";
const logo = (slug: string) => `${LOGO_CDN}/${slug}.svg`;

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
      logoUrl: logo("bri-new"),
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
      logoUrl: logo("cimb-niaga"),
    },
    {
      code: "permata",
      name: "Bank Permata",
      type: "bank_account",
      logoUrl: logo("permata-bank-new"),
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
    { code: "gopay", name: "GoPay", type: "e_wallet", logoUrl: logo("gopay") },
    { code: "ovo", name: "OVO", type: "e_wallet", logoUrl: logo("ovo-new") },
    { code: "dana", name: "DANA", type: "e_wallet", logoUrl: logo("dana") },
    {
      code: "shopeepay",
      name: "ShopeePay",
      type: "e_wallet",
      logoUrl: logo("shopee-pay"),
    },
    {
      code: "linkaja",
      name: "LinkAja",
      type: "e_wallet",
      logoUrl: logo("linkaja"),
    },
  ],
};
