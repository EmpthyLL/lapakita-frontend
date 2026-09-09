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
          className="h-8 rounded-full border-dashed border-primary/40 px-3 text-xs text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="mr-1.5 size-3.5" />
          {t("add_filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 text-xs" align="start">
        <Command className="rounded-lg">
          <CommandInput
            className="h-9 border-b px-3 text-xs"
            placeholder={t("filter_by_placeholder")}
          />
          {unselected.length < 1 ? (
            <div className="flex flex-col items-center gap-1.5 py-6 text-center text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary/50" />
              {t("all_filters_added")}
            </div>
          ) : (
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              {t("nothing_found")}
            </CommandEmpty>
          )}
          <CommandGroup className="p-1">
            <ScrollArea className="max-h-52 overflow-y-auto">
              {unselected.map((option, index) => {
                const Icon = FILTER_TYPE_ICON[option.type ?? "input"];
                return (
                  <CommandItem
                    key={String(index)}
                    className="gap-2 rounded-md px-2 py-1.5 text-xs capitalize cursor-pointer"
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
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-3" />
                    </span>
                    <span className="truncate">{option.title}</span>
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
