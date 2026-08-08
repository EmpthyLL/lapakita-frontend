"use client";

import { useRoleFilter } from "@/lib/role_provider";
import { ROLE_CONTENT, ROLE_ORDER } from "./FeatureData";
import { RoleContentSection } from "./RoleSection";

export function FeaturesContent() {
  const { activeRole } = useRoleFilter();

  if (activeRole === "all") {
    return (
      <>
        {ROLE_ORDER.map((role, i) => (
          <div
            key={role}
            className={i % 2 === 1 ? "bg-secondary/40" : undefined}
          >
            <RoleContentSection content={ROLE_CONTENT[role]} />
          </div>
        ))}
      </>
    );
  }

  return <RoleContentSection content={ROLE_CONTENT[activeRole]} />;
}
