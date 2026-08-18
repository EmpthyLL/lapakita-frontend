"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  STALL_PROPERTY_TYPES,
  StallPropertyTypeValue,
} from "./SearchConstants";

interface PropertyTypePickerProps {
  value: StallPropertyTypeValue[];
  onChange: (value: StallPropertyTypeValue[]) => void;
}

export function PropertyTypePicker({
  value,
  onChange,
}: PropertyTypePickerProps) {
  function handleToggle(typeValue: StallPropertyTypeValue) {
    if (value.includes(typeValue)) {
      // Hapus jika sudah terpilih
      onChange(value.filter((v) => v !== typeValue));
    } else {
      // Tambahkan jika belum terpilih
      onChange([...value, typeValue]);
    }
  }

  return (
    <div className="space-y-2 p-2">
      {STALL_PROPERTY_TYPES.map((type) => {
        const Icon = type.icon;
        const active = value.includes(type.value);

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => handleToggle(type.value)}
            className={cn(
              "group relative flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all outline-none",
              active
                ? "border-primary bg-primary-secondary/40 ring-1 ring-primary shadow-xs"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
            )}
          >
            {/* Icon Container */}
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                active
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>

            {/* Label & Description */}
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-xs font-semibold leading-tight transition-colors",
                  active ? "text-primary" : "text-foreground",
                )}
              >
                {type.label}
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                {type.description}
              </span>
            </span>

            {/* Check Badge Icon */}
            {active && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                <Check className="h-3 w-3 stroke-[2.5]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
