/* eslint-disable @next/next/no-img-element */
"use client";

import { PhoneForm } from "@/app/[locale]/dashboard/settings/phone/component/form";
import DialogWrapper from "@/components/common/DialogWrapper";
import { Autocomplete } from "@/components/common/long/autocomplete";
import { Button } from "@/components/ui/button";
import { getPhoneNumbers } from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";
import { Plus } from "lucide-react";
import { useState } from "react";

interface PhoneSelectorProps {
  value: number | null;
  onSelect: (value: number, option?: PhoneNumberItem) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function PhoneSelector({
  value,
  onSelect,
  placeholder = "Select contact phone number",
  disabled = false,
  hasError = false,
}: PhoneSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Autocomplete<PhoneNumberItem, PhoneQueryParams>
        value={value}
        onSelect={(val, option) => onSelect(Number(val), option)}
        asyncConfig={{
          queryFn: getPhoneNumbers,
          queryKey: ["phone-numbers-async"],
          searchKey: "search",
          initialLimit: 10,
        }}
        labelKey="display_label"
        valueKey="index"
        iconKey="flag"
        placeholder={placeholder}
        disabled={disabled}
        hasError={hasError}
        addButton={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full justify-start gap-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg h-9 px-2.5"
          >
            <Plus className="h-4 w-4" /> Add New Phone Number
          </Button>
        }
        renderConfig={{
          item: (option) => (
            <div className="flex items-center gap-2.5 py-1.5 w-full">
              {option.flag && (
                <img
                  src={option.flag}
                  alt="flag"
                  className="h-3.5 w-5 object-contain rounded-xs shrink-0 shadow-xs"
                />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-foreground text-xs truncate">
                  {option.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground truncate">
                  {option.dial_code} {option.number}
                </span>
              </div>
            </div>
          ),
          triggerAsCustom: false,
        }}
      />

      <DialogWrapper
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Phone Number"
        desc="Lengkapi informasi nomor telepon baru untuk akun Anda."
        size="sm"
      >
        <PhoneForm mode="create" close={() => setIsAddDialogOpen(false)} />
      </DialogWrapper>
    </>
  );
}
