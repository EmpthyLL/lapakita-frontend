"use client";

import { Role, RoleAndAll, VALID_ROLES } from "@/types";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

interface RoleFilterContextValue {
  activeRole: RoleAndAll;
  setActiveRole: (role: RoleAndAll) => void;
}

const RoleFilterContext = createContext<RoleFilterContextValue | null>(null);

function getInitialRole(param: string | null): RoleAndAll {
  if (param && VALID_ROLES.includes(param as Role)) {
    return param as Role;
  }
  return "all";
}

interface RoleFilterProviderProps {
  children: ReactNode;
  paramKey: string;
}

export function RoleFilterProvider({
  children,
  paramKey,
}: RoleFilterProviderProps) {
  const searchParams = useSearchParams();

  const [activeRole, setActiveRole] = useState<RoleAndAll>(() =>
    getInitialRole(searchParams.get(paramKey)),
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
