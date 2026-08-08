"use client";

import { Role, RoleAndAll, VALID_ROLES } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  syncUrl?: boolean;
}

export function RoleFilterProvider({
  children,
  paramKey,
  syncUrl = false,
}: RoleFilterProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeRole, setActiveRoleState] = useState<RoleAndAll>(() =>
    getInitialRole(searchParams.get(paramKey)),
  );

  function setActiveRole(role: RoleAndAll) {
    setActiveRoleState(role);

    if (!syncUrl) return;

    const params = new URLSearchParams(searchParams.toString());
    if (role === "all") {
      params.delete(paramKey);
    } else {
      params.set(paramKey, role);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

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
