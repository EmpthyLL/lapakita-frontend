"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FILTER_TYPE_ICON, FilterOption } from "./Constant";

interface FilterOptionsProps<TData> {
  options: FilterOption<TData>[];
  selectedOptions: FilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<FilterOption<TData>[]>
  >;
}

export function FilterOptions<TData>({
  options,
  selectedOptions,
  setSelectedOptions,
}: FilterOptionsProps<TData>) {
  const t = useTranslations("common.display_table");
  const [open, setOpen] = useState(false);
  const unselected = options.filter(
    (o) => !selectedOptions.find((s) => s.id === o.id),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {t("add_filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput
            className="border-b px-4 py-2"
            placeholder={t("filter_by_placeholder")}
          />
          {unselected.length < 1 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary/50" />
              {t("all_filters_added")}
            </div>
          ) : (
            <CommandEmpty>{t("nothing_found")}</CommandEmpty>
          )}
          <CommandGroup>
            <ScrollArea className="max-h-[60vh] overflow-y-scroll">
              {unselected.map((option, index) => {
                const Icon = FILTER_TYPE_ICON[option.type ?? "input"];
                return (
                  <CommandItem
                    key={String(index)}
                    className="gap-2 capitalize"
                    value={String(option.id).split("_").join(" ")}
                    onSelect={() => {
                      setOpen(false);
                      setSelectedOptions((prev) => {
                        const isSelected = prev.some(
                          (item) => item.id === option.id,
                        );
                        if (isSelected)
                          return prev.filter((item) => item.id !== option.id);
                        return [...prev, option];
                      });
                    }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {option.title}
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
