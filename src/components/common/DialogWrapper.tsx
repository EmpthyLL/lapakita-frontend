"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ReactNode, type FC } from "react";

interface DialogWrapperProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string | ReactNode;
  desc?: string | ReactNode;
  forceMount?: true;
  size?: "sm" | "md" | "lg" | "xl" | "full"; // opsi ukuran
  contentClassName?: string; // kalau mau custom bebas pakai Tailwind
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-4xl",
  full: "max-w-full",
};

const DialogWrapper: FC<DialogWrapperProps> = ({
  children,
  onOpenChange,
  open,
  trigger,
  forceMount,
  title,
  desc,
  size = "xl",
  contentClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          `${sizeMap[size]}`,
          "flex max-h-[85vh] flex-col",
          contentClassName,
        )}
        forceMount={forceMount}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle hidden={!title}>{title ?? "default title"}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
