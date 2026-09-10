"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ActionConfig, ActionItem, DropdownActionItem } from "../Constant";

export function renderActionItem<TData>(
  row: TData,
  action: ActionItem<TData>,
  defaultSize?: Extract<ActionConfig<TData>, { variant: "buttons" }>["size"],
) {
  if (action.render) return action.render(row);

  const Icon = action.icon;
  return (
    <Button
      key={action.id}
      variant={action.variant ?? "secondary"}
      size={action.size ?? defaultSize ?? "sm"}
      onClick={() => (action.action ?? action.onClick)?.(row)}
      disabled={action.disabled}
    >
      {Icon && <Icon />}
      {action.label}
    </Button>
  );
}

export function renderActionConfig<TData>(
  row: TData,
  config: ActionConfig<TData>,
) {
  if (config.variant === "custom") return config.render(row);

  if (config.variant === "buttons") {
    return (
      <div className="flex items-center justify-end gap-2">
        {config.items.map((action) =>
          renderActionItem(row, action, config.size),
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={config.size ?? "icon-sm"}
            aria-label="Actions"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={config.align ?? "end"}>
          {config.items.map((item) => renderDropdownItem(row, item))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function renderDropdownItem<TData>(
  row: TData,
  item: DropdownActionItem<TData>,
) {
  if (item.render) return <div key={item.id}>{item.render(row)}</div>;

  const Icon = item.icon;
  return (
    <DropdownMenuItem
      key={item.id}
      disabled={item.disabled}
      onSelect={() => (item.action ?? item.onClick)?.(row)}
      variant={item.destructive ? "destructive" : "default"}
    >
      {Icon && <Icon />}
      {item.label}
    </DropdownMenuItem>
  );
}
