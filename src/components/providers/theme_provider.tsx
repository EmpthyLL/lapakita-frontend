"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

export type AppRole = "venture" | "owner" | "supplier";

interface RoleThemeContextType {
  role: AppRole;
  roleColor: string;
  roleForeground: string;
  roleSecondary: string;
}

const RoleThemeContext = React.createContext<RoleThemeContextType>({
  role: "venture",
  roleColor: "var(--venture)",
  roleForeground: "var(--venture-foreground)",
  roleSecondary: "var(--venture-secondary)",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const role: AppRole = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const dashboardIndex = segments.lastIndexOf("dashboard");
    const pathRole = segments[dashboardIndex + 1];
    if (pathRole === "owner" || pathRole === "supplier") return pathRole;
    return "venture";
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
