"use client";

import { VALID_ROLES, type Role, type RoleAndAll } from "@/types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RoleContextValue<T extends RoleAndAll> {
  activeRole: T;
  setActiveRole: (role: RoleAndAll) => void;
  isWalletPage: boolean;
  isSettingsPage: boolean;
  isDashboardPage: boolean;
  session: ReturnType<typeof useSession>["data"];
}

export function useRoleContext(paramKey?: string): RoleContextValue<Role>;
export function useRoleContext(
  paramKey: string,
  defaultRole: "all",
): RoleContextValue<RoleAndAll>;
export function useRoleContext(
  paramKey = "role",
  defaultRole: RoleAndAll = "tenant",
): RoleContextValue<RoleAndAll> {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const isWalletPage = pathname.startsWith("/dashboard/wallet");
  const isSettingsPage = pathname.startsWith("/dashboard/settings");
  const isDashboardPage = pathname.startsWith("/dashboard");

  const searchParamRole = searchParams.get(paramKey);
  let detectedRole: RoleAndAll = defaultRole;

  if (searchParamRole && VALID_ROLES.includes(searchParamRole as Role)) {
    detectedRole = searchParamRole as Role;
  } else if (searchParamRole === "all" && defaultRole === "all") {
    detectedRole = "all";
  } else if (defaultRole !== "all") {
    const segments = pathname.split("/").filter(Boolean);
    const pathRole = segments.find((seg) =>
      VALID_ROLES.includes(seg as Role),
    ) as Role;

    if (pathRole) {
      detectedRole = pathRole;
    } else if (
      session?.user?.activeRole &&
      VALID_ROLES.includes(session.user.activeRole as Role)
    ) {
      detectedRole = session.user.activeRole as Role;
    }
  }

  const setActiveRole = (role: RoleAndAll) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, role);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return {
    activeRole: detectedRole,
    setActiveRole,
    isWalletPage,
    isSettingsPage,
    isDashboardPage,
    session,
  };
}
