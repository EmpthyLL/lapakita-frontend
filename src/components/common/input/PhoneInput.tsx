/* eslint-disable @next/next/no-img-element */
"use client";

import { Autocomplete } from "@/components/common/input/Autocomplete";
import { Input } from "@/components/ui/input";
import { CountryPhoneOption, getAllCountryPhoneOptions } from "@/lib/countries";
import { cn } from "@/lib/utils";
import * as React from "react";

interface PhoneInputProps {
  dialCodeValue?: string;
  onDialCodeChange: (code: string) => void;
  phoneValue?: string;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function PhoneInput({
  dialCodeValue = "+62",
  onDialCodeChange,
  phoneValue = "",
  onPhoneChange,
  placeholder = "812 3456 7890",
  disabled = false,
  hasError = false,
}: PhoneInputProps) {
  const countryOptions = React.useMemo(() => getAllCountryPhoneOptions(), []);

  return (
    <div
      className={cn(
        "flex w-full items-center rounded-md border border-input bg-background transition-all duration-150 overflow-hidden",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:ring-2 group-data-[invalid=true]/field:ring-destructive/20",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        hasError && "border-destructive ring-2 ring-destructive/20",
        disabled &&
          "pointer-events-none cursor-not-allowed bg-muted opacity-50",
      )}
    >
      {/* Select / Autocomplete Dial Code di Kiri (Lebar pas w-28) */}
      <div className="w-28 shrink-0 border-r border-input bg-secondary/30">
        <Autocomplete<CountryPhoneOption>
          value={dialCodeValue}
          onSelect={(val) => onDialCodeChange(String(val))}
          options={countryOptions}
          valueKey="value"
          labelKey="label"
          iconKey="flag"
          disabled={disabled}
          mode="solid"
          size="sm"
          className="flex-1 border-0 p-0 shadow-none focus-within:ring-0 [&_img]:w-5 [&_img]:h-4 [&_img]:object-contain [&_img]:shrink-0 [&_img]:rounded-xs"
          placeholder="+62"
          renderItem={(option) => (
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-2 truncate">
                <img
                  src={option.flag}
                  alt={option.name}
                  className="w-5 h-4 object-contain shrink-0 rounded-xs"
                />
                <span className="text-xs font-medium truncate text-foreground">
                  {option.name}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground ml-2">
                {option.value}
              </span>
            </div>
          )}
        />
      </div>

      {/* Input Nomor Telepon di Kanan */}
      <div className="flex-1 min-w-0">
        <Input
          type="tel"
          value={phoneValue}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 rounded-none"
        />
      </div>
    </div>
  );
}
