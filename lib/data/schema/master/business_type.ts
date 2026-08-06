
/* ---------------------------------------------------------------------- */
/* 2. Business categories (grouped)                                        */
/* ---------------------------------------------------------------------- */

export interface BusinessType {
  value: string;
  label: string;
}

export interface BusinessCategoryGroup {
  group: string;
  types: BusinessType[];
}

export const BUSINESS_CATEGORIES: BusinessCategoryGroup[] = [
  {
    group: "F&B (Food & Beverages)",
    types: [
      { value: "full-service-restaurant", label: "Full-Service Restaurant" },
      { value: "coffee-shop", label: "Coffee Shop & Cafe" },
      { value: "bakery", label: "Bakery & Pastry Shop" },
      { value: "fast-food", label: "Quick-Service / Fast Food" },
      { value: "beverage-kiosk", label: "Beverage & Snack Kiosk" },
    ],
  },
  {
    group: "Retail & Commerce",
    types: [
      { value: "mini-market", label: "Mini Market & Convenience Store" },
      { value: "fashion", label: "Fashion & Apparel Boutique" },
      { value: "general-retail", label: "General Retail & Hobby Store" },
    ],
  },
  {
    group: "Services",
    types: [
      { value: "beauty-salon", label: "Beauty Salon & Barbershop" },
      { value: "repair-shop", label: "Service & Repair Shop" },
      { value: "professional-office", label: "Professional Office & Agency" },
      { value: "education-studio", label: "Education & Studio Space" },
    ],
  },
];