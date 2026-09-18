/* eslint-disable @next/next/no-img-element */
"use client";

import { createColumnHelpers } from "@/components/common/long/data-display/Constant";
import { Badge } from "@/components/ui/badge";
import { PhoneNumberItem } from "@/lib/data/schema/user/phone_number";
import { Role } from "@/types";
import {
  CheckCircle2,
  MoreVertical,
  Phone as PhoneIcon,
  ShieldCheck,
} from "lucide-react";
import { PhoneRowActions } from "./rowAction";

export function usePhoneColumns() {
  const { field, action } = createColumnHelpers<PhoneNumberItem>();

  return [
    field({
      key: "number",
      header: "Phone Number",
      icon: PhoneIcon,
      primary: true,
      className: "font-mono font-semibold text-foreground",
      render: (val, row) => {
        if (!val) return "-";

        const dialCode = row.dial_code || "+62";
        const phoneNumber = val || "";

        return (
          <div className="flex items-center gap-2.5">
            {/* Render Flag Negara */}
            <img
              src={row.flag}
              alt="Country flag"
              className="h-3.5 w-5 object-contain rounded-xs shrink-0 shadow-xs"
            />
            <span>
              {dialCode} {phoneNumber}
            </span>
          </div>
        );
      },
    }),

    field({
      key: "is_primary",
      header: "Status Primary",
      icon: ShieldCheck,
      render: (val) =>
        val ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Primary
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Backup</span>
        ),
    }),

    field({
      key: "roles",
      header: "Connected Roles",
      render: (val) => {
        const roles = val ?? [];
        if (roles.length === 0) {
          return (
            <span className="text-xs text-muted-foreground italic">
              No roles linked
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge
                key={r}
                variant={r as Role}
                className="capitalize text-[10px] px-2 py-0.5 font-medium"
              >
                {r}
              </Badge>
            ))}
          </div>
        );
      },
    }),

    action({
      header: "Actions",
      icon: MoreVertical,
      className: "w-20 text-right",
      render: (row, _index, action) => (
        <PhoneRowActions row={row} action={action} />
      ),
    }),
  ];
}
