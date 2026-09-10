"use client";

import DialogWrapper from "@/components/common/DialogWrapper";
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

export function PhoneTable() {
  const [createOpen, setCreateOpen] = useState(false);

  const queryConfig: DataDisplayQuery<PhoneNumberItem, PhoneQueryParams> = {
    queryFn: getPhoneNumbers,
    queryKey: (params) => ["phone-numbers", params],
    searchKey: "number",
    defaultParams: { page: 1 },
  };

  const columns = usePhoneColumns();

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <DataDisplay
          columns={columns}
          query={queryConfig}
          rowKey="number"
          variant="list"
          loadMode="pagination"
          showCount
          toolbarExtraAction={
            <Button
              onClick={() => setCreateOpen(true)}
              size="sm"
              className="h-10 gap-1.5 rounded-xl px-3.5 text-xs"
            >
              <Plus className="h-4 w-4" /> Add Phone Number
            </Button>
          }
        />
      </div>

      <DialogWrapper
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Phone Number"
        desc="Pastikan nomor minimal 10 digit. Setiap role hanya boleh terikat ke satu nomor unik."
        size="sm"
      >
        <PhoneForm
          mode="create"
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </DialogWrapper>
    </>
  );
}
