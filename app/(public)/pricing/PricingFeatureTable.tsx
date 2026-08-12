import type { Role } from "@/types";
import { Check, X } from "lucide-react";
import { PRICING_FEATURE_TABLES } from "./PricingData";

export function PricingFeatureTable({ role }: { role: Role }) {
  const rows = PRICING_FEATURE_TABLES[role];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
      <table className="w-full min-w-140 border-collapse text-sm">
        <thead>
          <tr className="bg-secondary/60">
            <th className="p-4 text-left font-semibold text-foreground">
              Feature / Capability
            </th>
            <th className="p-4 text-left font-semibold text-muted-foreground">
              Free Tier
            </th>
            <th className="p-4 text-left font-semibold text-primary">
              Premium
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.feature}
              className={i % 2 === 1 ? "bg-secondary/20" : undefined}
            >
              <td className="border-t border-border p-4 font-medium text-foreground">
                {row.feature}
              </td>
              <td className="border-t border-border p-4 text-muted-foreground">
                {row.free ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {row.freeLabel ?? "Included"}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-muted-foreground/60">
                    <X className="h-4 w-4" />
                    Not included
                  </span>
                )}
              </td>
              <td className="border-t border-border p-4 text-foreground">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {row.premiumLabel ?? "Included"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
