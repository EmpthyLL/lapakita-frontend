"use client";

import { cn } from "@/lib/utils";
import { Building, MessageSquare } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ContactTabSwitch({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "partnership") {
      params.set("intent", "partnership");
    } else {
      params.delete("intent");
    }
    router.replace(`/contact?${params.toString()}`, {
      scroll: false,
    });
  };

  const isPartnership = activeTab === "partnership";

  return (
    <div className="flex rounded-2xl border border-border bg-secondary/40 p-1.5 shadow-2xs">
      <button
        type="button"
        onClick={() => handleTabChange("support")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wide transition-all cursor-pointer",
          !isPartnership
            ? "bg-gradient-brand text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <MessageSquare className="h-4 w-4" />
        Customer Support & Inquiry
      </button>

      <button
        type="button"
        onClick={() => handleTabChange("partnership")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wide transition-all cursor-pointer",
          isPartnership
            ? "bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Building className="h-4 w-4" />
        Partnership & B2B Proposal
      </button>
    </div>
  );
}
