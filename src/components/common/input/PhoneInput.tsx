// components/common/input/PhoneInput.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllCountryPhoneOptions } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search } from "lucide-react";
import * as React from "react";

export interface PhoneValue {
  dial_code: string;
  number: string;
}

interface PhoneInputProps {
  value?: PhoneValue;
  onChange: (value: PhoneValue) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function PhoneInput({
  value = { dial_code: "+62", number: "" },
  onChange,
  placeholder = "812 3456 7890",
  disabled = false,
  hasError = false,
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const countryOptions = React.useMemo(() => getAllCountryPhoneOptions(), []);

  const selectedCountry = React.useMemo(() => {
    return (
      countryOptions.find((c) => c.value === value.dial_code) ||
      countryOptions.find((c) => c.value === "+62")
    );
  }, [countryOptions, value.dial_code]);

  const handledial_codeChange = (newdial_code: string) => {
    onChange({
      dial_code: newdial_code,
      number: value.number,
    });
  };

  const handleNumberChange = (newNumber: string) => {
    onChange({
      dial_code: value.dial_code,
      number: newNumber,
    });
  };

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
      {/* Popover Selector untuk Dial Code di Kiri */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-expanded={open}
            className={cn(
              "flex h-10 w-28 shrink-0 items-center justify-between gap-1.5 border-r border-input bg-secondary/30 px-3 text-sm font-semibold text-foreground transition-colors",
              "hover:bg-secondary/50 focus:outline-none",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedCountry && (
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  className="w-5 h-4 object-contain shrink-0 rounded-xs"
                />
              )}
              <span className="truncate">
                {selectedCountry?.value || "+62"}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0 rounded-lg shadow-lg" align="start">
          <Command>
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <CommandInput
                placeholder="Search country or code..."
                className="h-10 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
              />
            </div>
            <CommandList className="max-h-64 overflow-y-auto p-1">
              <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                No country found.
              </CommandEmpty>
              <CommandGroup>
                {countryOptions.map((option) => {
                  const isSelected = option.value === value.dial_code;
                  return (
                    <CommandItem
                      key={`${option.code}-${option.value}`}
                      value={`${option.name} ${option.value}`}
                      onSelect={() => {
                        handledial_codeChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm",
                        isSelected && "bg-primary/10 font-medium text-primary",
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={option.flag}
                          alt={option.name}
                          className="w-5 h-4 object-contain shrink-0 rounded-xs"
                        />
                        <span className="truncate font-medium text-foreground">
                          {option.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {option.value}
                        </span>
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Input Nomor Telepon di Kanan */}
      <div className="flex-1 min-w-0">
        <Input
          type="tel"
          value={value.number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 rounded-none"
        />
      </div>
    </div>
  );
}
