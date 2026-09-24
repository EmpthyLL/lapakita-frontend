"use client";

import { DataDisplay } from "@/components/common/long/data-display";
import { DataDisplayQuery } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getAllCountryPhoneOptions } from "@/lib/countries";
import { getPhoneNumbers } from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";
import { Plus } from "lucide-react";
import { PhoneForm } from "../component/form";
import { usePhoneColumns } from "./column";

const ROLE_FILTER_OPTIONS = [
  { label: "Tenant", value: "tenant" },
  { label: "Owner", value: "owner" },
  { label: "Supplier", value: "supplier" },
];

export default function PhoneList() {
  const countryOptions = getAllCountryPhoneOptions().map((opt) => ({
    label: opt.label,
    value: opt.value,
    icon: opt.flag,
  }));

  const queryConfig: DataDisplayQuery<PhoneNumberItem, PhoneQueryParams> = {
    queryFn: getPhoneNumbers,
    queryKey: (params) => ["phone-numbers", params],
    searchKey: "search",
    searchPlaceholder: "Cari label atau nomor telepon...",
    defaultParams: { page: 1 },
    filterOptions: [
      {
        id: "dial_code",
        title: "Dial Code",
        type: "select",
        options: countryOptions,
      },
      {
        id: "role",
        title: "Role",
        type: "select",
        options: ROLE_FILTER_OPTIONS,
      },
    ],
  };

  const columns = usePhoneColumns();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <DataDisplay
        columns={columns}
        query={queryConfig}
        rowKey="index"
        variant="list"
        loadMode="pagination"
        showFilter
        showCount
        form={{
          type: "dialog",
          title: "Phone Number Management",
          description:
            "Pastikan nomor valid. Setiap role dapat terikat ke nomor yang sesuai.",
          component: PhoneForm,
          size: "sm",
        }}
        toolbarExtraAction={({ openCreate, isLoading }) => (
          <Button
            onClick={() => openCreate("dialog")}
            disabled={isLoading}
            size="sm"
            className="h-10 gap-1.5 px-3.5 text-xs rounded-xl"
          >
            <Plus className="h-4 w-4" /> Add Phone Number
          </Button>
        )}
      />
    </div>
  );
}
