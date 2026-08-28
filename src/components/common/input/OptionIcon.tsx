import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

export type IconValue = string | LucideIcon;

export function isLucideIcon(icon: unknown): icon is LucideIcon {
  return (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "render" in (icon as object))
  );
}

export function OptionIcon({
  icon,
  size,
  alt,
  className,
}: {
  icon: IconValue;
  size: number;
  alt: string;
  className?: string;
}) {
  if (isLucideIcon(icon)) {
    const Icon = icon;
    return (
      <Icon
        className={cn("shrink-0 text-muted-foreground", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Image
      src={String(icon)}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      alt={alt}
      unoptimized
    />
  );
}
