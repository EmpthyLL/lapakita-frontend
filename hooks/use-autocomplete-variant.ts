"use client";

import { VariantColor } from "@/types";
import { usePathname } from "next/navigation";

export type AutocompleteVariant = VariantColor;

/**
 * Derives the active variant color from the current route.
 * /owner/**   -> "owner"   (green)
 * /supplier/** -> "supplier" (teal)
 * everything else -> "primary" (tenant / blue), the default
 */
export function useAutocompleteVariant(): AutocompleteVariant {
  const pathname = usePathname() ?? "";

  if (pathname.includes("/owner")) return "owner";
  if (pathname.includes("/supplier")) return "supplier";
  return "primary";
}