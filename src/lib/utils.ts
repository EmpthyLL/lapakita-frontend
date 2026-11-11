import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
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

export function formatNumber(
  value: number,
  options: {
    locale?: string;
    maximumFractionDigits?: number;
    notation?: "standard" | "compact";
  } = {},
) {
  const {
    locale = "id-ID",
    maximumFractionDigits = 1,
    notation = "standard",
  } = options;

  return new Intl.NumberFormat(locale, {
    notation,
    maximumFractionDigits,
  }).format(value);
}

export function toWhatsAppLink(phone: string, message?: string) {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const isValidDate = (date: Date | string | undefined): boolean => {
  if (date === undefined) return false;
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

/**
 * Universal Date Formatter menggunakan date-fns dengan preset yang diperkaya
 */
export function formatDate(
  dateInput: Date | string | number,
  formatStr:
    | "short" // 11/11/26
    | "medium" // 11 Nov 2026
    | "full" // 11 November 2026
    | "long" // Thursday, November 11, 2026
    | "with-day" // Wed, 11 Nov 2026
    | "with-day-full" // Wednesday, 11 November 2026
    | "time" // 16:46
    | "datetime" // 11 Nov 2026, 16:46
    | string = "medium",
): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  switch (formatStr) {
    case "short":
      return format(date, "dd/MM/yy");
    case "medium":
      return format(date, "dd MMM yyyy");
    case "full":
      return format(date, "dd MMMM yyyy");
    case "long":
      return format(date, "EEEE, MMMM d, yyyy");
    case "with-day":
      return format(date, "EEE, dd MMM yyyy");
    case "with-day-full":
      return format(date, "EEEE, dd MMMM yyyy");
    case "time":
      return format(date, "HH:mm");
    case "datetime":
      return format(date, "dd MMM yyyy, HH:mm");
    default:
      // Custom format string langsung dari date-fns
      return format(date, formatStr);
  }
}

export interface FormatRelativeOptions {
  maxRelativeDays?: number;
  dateFormat?: Parameters<typeof formatDate>[1];
}

export function formatRelativeTime(
  dateInput: string | Date | number,
  options: FormatRelativeOptions = {},
): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  const { maxRelativeDays = 7, dateFormat = "medium" } = options;

  if (diffInDays > maxRelativeDays) {
    return formatDate(date, dateFormat);
  }

  return formatDistanceToNow(date, { addSuffix: true });
}
