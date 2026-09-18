"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

type Variant = "destructive" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  children?: ReactNode;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  onContinue?: () => void;
  onCancel?: () => void;

  title?: string;
  description?: ReactNode;

  confirmText?: string;
  cancelText?: string;

  variant?: Variant;
  isLoading?: boolean;

  remark?: boolean;
  remarkName?: string;
  onRemarkChange?: (val: string) => void;
}

const variantConfig = {
  destructive: {
    icon: AlertTriangle,
    iconBg: "bg-destructive/15 text-destructive",
    iconRing: "ring-destructive/20",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: ShieldAlert,
    iconBg: "bg-warning/15 text-warning",
    iconRing: "ring-warning/20",
    buttonVariant: "warning" as const,
  },
  info: {
    icon: Info,
    iconBg: "bg-primary/15 text-primary",
    iconRing: "ring-primary/20",
    buttonVariant: "default" as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-success/15 text-success",
    iconRing: "ring-success/20",
    buttonVariant: "default" as const,
  },
} as const;

export default function ConfirmDialog({
  children,
  onContinue = () => {},
  onCancel = () => {},

  open,
  onOpenChange,

  title = "Are you sure?",
  description = "Please confirm this action.",

  confirmText = "Continue",
  cancelText = "Cancel",

  variant = "info",
  isLoading = false,

  remark = false,
  remarkName = "remark",
  onRemarkChange = () => {},
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [remarkValue, setRemarkValue] = useState("");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (remark) onRemarkChange(remarkValue);
    onContinue();
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          {children ?? (
            <Button variant={config.buttonVariant}>{confirmText}</Button>
          )}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-2xl sm:max-w-md">
        {/* Aksen Glow Halus di Background agar Lebih 'Rame' & Tidak Kaku */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-brand opacity-10 blur-3xl pointer-events-none" />

        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ring-4 ${config.iconRing} transition-transform duration-300 hover:scale-105`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div className="space-y-1 pt-0.5">
              <AlertDialogTitle className="font-heading text-lg font-bold tracking-tight text-foreground">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs/relaxed text-muted-foreground font-normal">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {remark && (
          <div className="pt-3 pb-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {remarkName}
            </label>
            <Input
              placeholder={`Enter ${remarkName.toLowerCase()}...`}
              value={remarkValue}
              onChange={(e) => {
                setRemarkValue(e.target.value);
                onRemarkChange(e.target.value);
              }}
              className="h-11 rounded-xl bg-background border-border focus-visible:ring-primary text-sm shadow-inner"
            />
          </div>
        )}

        <AlertDialogFooter className="mt-5 pt-4 border-t border-border/80 flex gap-2.5 sm:gap-2.5">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={handleCancel}
            className="flex-1 rounded-xl border-border bg-background hover:bg-secondary text-xs font-semibold h-11 px-4 mt-0 transition-all cursor-pointer"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleContinue}
            variant={config.buttonVariant}
            className="flex-1 rounded-xl text-xs font-semibold h-11 px-4 shadow-sm transition-all cursor-pointer"
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
