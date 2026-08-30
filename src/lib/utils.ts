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

export function toWhatsAppLink(phone: string, message?: string) {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export interface FormatRelativeOptions {
  /** Maksimal selisih hari sebelum beralih ke format tanggal pasti (Default: 7 hari) */
  maxRelativeDays?: number;
  /** Format tanggal pasti jika melewati maxRelativeDays (Default: "DD MMM YYYY") */
  dateFormat?: "short" | "medium" | "full";
  /** Menampilkan unit waktu hingga kedalaman tertentu (e.g. "week" | "day" | "hour") */
  maxUnit?: "year" | "month" | "week" | "day" | "hour" | "minute";
}

/**
  Formats an RFC3339/ISO date string into a readable relative time string or absolute date.
 * Examples: "2 mins ago", "3 days ago", "2 weeks ago", "15 Aug 2026"
 */
export function formatRelativeTime(
  dateInput: string | Date | number,
  options: FormatRelativeOptions = {},
): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Jika waktu di masa depan atau < 5 detik
  if (diffInSeconds < 5) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const { maxRelativeDays = 7, dateFormat = "medium", maxUnit } = options;

  // 1. Jika melebihi batas hari relatif -> Format ke Tanggal Absolut
  if (diffInDays > maxRelativeDays) {
    return formatDateAbsolute(date, dateFormat);
  }

  // 2. Evaluasi berdasarkan kedalaman maxUnit atau hirarki alami
  if (
    diffInYears >= 1 &&
    maxUnit !== "month" &&
    maxUnit !== "week" &&
    maxUnit !== "day"
  ) {
    return `${diffInYears} yr${diffInYears > 1 ? "s" : ""} ago`;
  }

  if (diffInMonths >= 1 && maxUnit !== "week" && maxUnit !== "day") {
    return `${diffInMonths} mo${diffInMonths > 1 ? "s" : ""} ago`;
  }

  if (diffInWeeks >= 1 && maxUnit !== "day" && maxUnit !== "hour") {
    return `${diffInWeeks} wk${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  if (diffInDays >= 1 && maxUnit !== "hour" && maxUnit !== "minute") {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  if (diffInHours >= 1 && maxUnit !== "minute") {
    return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
  }

  if (diffInMinutes >= 1) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  return `${diffInSeconds} sec${diffInSeconds > 1 ? "s" : ""} ago`;
}

/**
 * Format tanggal absolut
 */
export function formatDateAbsolute(
  date: Date,
  format: "short" | "medium" | "full" = "medium",
): string {
  if (format === "short") {
    // 15/08/26
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  }

  if (format === "full") {
    // 15 Agustus 2026
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  // Medium default: 15 Aug 2026
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
