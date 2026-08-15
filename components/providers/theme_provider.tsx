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

  const dynamicStyles = React.useMemo(() => {
    return {
      "--primary": `var(--${role})`,
      "--primary-foreground": `var(--${role}-foreground)`,
      "--primary-secondary": `var(--${role}-secondary)`,
      "--ring": `var(--${role})`,
    } as React.CSSProperties;
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
      <div data-role={role} className="contents" style={dynamicStyles}>
        {children}
      </div>
    </RoleThemeContext.Provider>
  );
}

export function useRoleTheme() {
  return React.useContext(RoleThemeContext);
}
