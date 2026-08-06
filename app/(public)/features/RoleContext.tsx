"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Role, VALID_ROLES } from "@/types";

interface RoleFilterContextValue {
  activeRole: RoleAndAll;
  setActiveRole: (role: Role) => void;
}

export type RoleAndAll = Role | "all";

const RoleFilterContext = createContext<RoleFilterContextValue | null>(null);

function getInitialRole(param: string | null): RoleAndAll {
  if (param && VALID_ROLES.includes(param as Role)) {
    return param as Role;
  }
  return "all";
}

export function RoleFilterProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [activeRole, setActiveRole] = useState<RoleAndAll>(() =>
    getInitialRole(searchParams.get("role")),
  );

  return (
    <RoleFilterContext.Provider value={{ activeRole, setActiveRole }}>
      {children}
    </RoleFilterContext.Provider>
  );
}

export function useRoleFilter() {
  const ctx = useContext(RoleFilterContext);
  if (!ctx) {
    throw new Error("useRoleFilter must be used within a RoleFilterProvider");
  }
  return ctx;
}
