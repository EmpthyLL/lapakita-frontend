"use client";

import { ColumnDef } from "@/components/common/long/data-display/Constant";
import { Badge } from "@/components/ui/badge";
import { PhoneNumberItem } from "@/lib/data/schema/user/phone_number";
import { Role } from "@/types";
import {
  CheckCircle2,
  MoreVertical,
  Pencil,
  Phone as PhoneIcon,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PhoneDeleteAction, PhoneEditAction } from "./phoneActions";

export function usePhoneColumns(): ColumnDef<PhoneNumberItem>[] {
  return [
    {
      key: "number",
      header: "Phone Number",
      icon: PhoneIcon,
      primary: true,
      className: "font-mono font-semibold text-foreground",
    },
    {
      key: "is_primary",
      header: "Status Primary",
      icon: ShieldCheck,
      render: (val) =>
        Boolean(val) ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Primary
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Secondary</span>
        ),
    },
    {
      key: "roles",
      header: "Connected Roles",
      render: (val) => {
        const roles: string[] = Array.isArray(val) ? val : [];
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
    },
    {
      kind: "action",
      header: "Actions",
      icon: MoreVertical,
      className: "w-20 text-right",
      action: {
        variant: "dropdown",
        size: "icon-sm",
        items: [
          {
            id: "edit",
            label: "Edit",
            icon: Pencil,
            render: (row) => <PhoneEditAction row={row} />,
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            render: (row) => <PhoneDeleteAction row={row} />,
          },
        ],
      },
    },
  ];
}
