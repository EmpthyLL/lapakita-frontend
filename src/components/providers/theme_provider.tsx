"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

export type AppRole = "tenant" | "owner" | "supplier";

interface RoleThemeContextType {
  role: AppRole;
  roleColor: string;
  roleForeground: string;
  roleSecondary: string;
}

const RoleThemeContext = React.createContext<RoleThemeContextType>({
  role: "tenant",
  roleColor: "var(--tenant)",
  roleForeground: "var(--tenant-foreground)",
  roleSecondary: "var(--tenant-secondary)",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const role: AppRole = React.useMemo(() => {
    if (pathname.includes("/owner")) return "owner";
    if (pathname.includes("/supplier")) return "supplier";
    return "tenant";
  }, [pathname]);

  // Otomatis pasang style ke document.body agar Portaled UI (Popover, Modal, Dropdown) ikut berubah
  React.useEffect(() => {
    const body = document.body;
    body.setAttribute("data-role", role);
    body.style.setProperty("--primary", `var(--${role})`);
    body.style.setProperty("--primary-foreground", `var(--${role}-foreground)`);
    body.style.setProperty("--primary-secondary", `var(--${role}-secondary)`);
    body.style.setProperty("--ring", `var(--${role})`);
  }, [role]);

  const contextValue = React.useMemo<RoleThemeContextType>(
    () => ({
      role,
      roleColor: `var(--${role})`,
      roleForeground: `var(--${role}-foreground)`,
      roleSecondary: `var(--${role}-secondary)`,
    }),
    [role],
  );

  return (
    <RoleThemeContext.Provider value={contextValue}>
      {children}
    </RoleThemeContext.Provider>
  );
}

export function useRoleTheme() {
  return React.useContext(RoleThemeContext);
}
