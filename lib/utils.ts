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
