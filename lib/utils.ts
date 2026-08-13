import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string) {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export const formatCurrency = (
  amount: number,
  prefix: string = "",
  maxDigits: number = 2,
  locale: string = "en-US",
) => {
  return (
    prefix +
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDigits,
    }).format(amount)
  );
};
