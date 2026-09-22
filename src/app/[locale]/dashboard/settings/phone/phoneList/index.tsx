"use client";

import { DataDisplay } from "@/components/common/long/data-display";
import { DataDisplayQuery } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { getPhoneNumbers } from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  PhoneQueryParams,
} from "@/lib/data/schema/user/phone_number";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PhoneForm } from "../component/form";
import { usePhoneColumns } from "./column";

export default function PhoneList() {
  const [createOpen, setCreateOpen] = useState(false);

  const queryConfig: DataDisplayQuery<PhoneNumberItem, PhoneQueryParams> = {
    queryFn: getPhoneNumbers,
    queryKey: (params) => ["phone-numbers", params],
    searchKey: "seach",
    defaultParams: { page: 1 },
  };

  const columns = usePhoneColumns();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <DataDisplay
        columns={columns}
        query={queryConfig}
        rowKey="number"
        variant="list"
        loadMode="pagination"
        showCount
        form={{
          type: "dialog",
          title: "Phone Number Management",
          description:
            "Pastikan nomor minimal 10 digit. Setiap role hanya boleh terikat ke satu nomor unik.",
          component: PhoneForm,
          size: "sm",
        }}
        toolbarExtraAction={({ openCreate, isLoading }) => (
          <Button
            onClick={() => openCreate()}
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
