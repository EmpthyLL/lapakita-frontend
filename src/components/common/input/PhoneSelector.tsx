/* eslint-disable @next/next/no-img-element */
"use client";

import { PhoneForm } from "@/app/[locale]/dashboard/settings/phone/component/form";
import { Autocomplete } from "@/components/common/long/autocomplete";
import { getPhoneNumbers } from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";

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
  return (
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
      addConfig={{
        label: "Add New Phone Number",
        form: {
          title: "Add New Phone Number",
          description: "Lengkapi informasi nomor telepon baru untuk akun Anda.",
          size: "sm",
          component: ({ close }) => <PhoneForm mode="create" close={close} />,
        },
      }}
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
  );
}
