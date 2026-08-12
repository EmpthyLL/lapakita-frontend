"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const role = React.useMemo(() => {
    if (pathname.includes("/owner")) return "owner";
    if (pathname.includes("/supplier")) return "supplier";
    return "primary";
  }, [pathname]);

  // Jika role primary (default), kembalikan style kosong agar menggunakan nilai asli dari globals.css
  const dynamicStyles = React.useMemo(() => {
    if (role === "primary") return undefined;

    return {
      "--primary": `var(--${role})`,
      "--primary-foreground": `var(--${role}-foreground)`,
      "--primary-secondary": `var(--${role}-secondary)`,
      "--ring": `var(--${role})`,
    } as React.CSSProperties;
  }, [role]);

  return (
    <div data-role={role} className="contents" style={dynamicStyles}>
      {children}
    </div>
  );
}
