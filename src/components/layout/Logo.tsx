import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "full" = icon + wordmark, "mark" = icon only (compact / mobile) */
  variant?: "full" | "mark";
  className?: string;
  href?: string;
}

export function Logo({ variant = "mark", className, href = "/" }: LogoProps) {
  if (variant === "mark") {
    return (
      <Link
        href={href}
        className={cn("shrink-0", className)}
        aria-label="Lapakita"
      >
        <Image
          src="/img/ic_logo.png"
          alt="Lapakita"
          width={120}
          height={120}
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn("shrink-0", className)}
      aria-label="Lapakita"
    >
      <Image
        src="/img/ic_logo_name.png"
        alt="Lapakita"
        width={160}
        height={40}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}
