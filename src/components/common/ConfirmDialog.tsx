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
    iconBg:
      "bg-destructive/15 text-destructive border border-destructive/20 shadow-lg shadow-destructive/10",
    iconRing: "ring-destructive/20",
    buttonVariant: "destructive" as const,
    glowColor: "bg-destructive/15",
  },
  warning: {
    icon: ShieldAlert,
    iconBg:
      "bg-warning/15 text-warning border border-warning/20 shadow-lg shadow-warning/10",
    iconRing: "ring-warning/20",
    buttonVariant: "warning" as const,
    glowColor: "bg-warning/15",
  },
  info: {
    icon: Info,
    iconBg:
      "bg-primary/15 text-primary border border-primary/20 shadow-lg shadow-primary/10",
    iconRing: "ring-primary/20",
    buttonVariant: "default" as const,
    glowColor: "bg-primary/15",
  },
  success: {
    icon: CheckCircle,
    iconBg:
      "bg-success/15 text-success border border-success/20 shadow-lg shadow-success/10",
    iconRing: "ring-success/20",
    buttonVariant: "default" as const,
    glowColor: "bg-success/15",
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

      <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden rounded-[28px] border border-border/80 bg-card p-6 shadow-2xl shadow-primary/5 sm:max-w-lg w-full backdrop-blur-xl">
        {/* Dekorasi Glow & Ambient Light di Background */}
        <div
          className={`absolute -top-16 -right-16 h-44 w-44 rounded-full ${config.glowColor} opacity-40 blur-3xl pointer-events-none`}
        />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-secondary/50 opacity-50 blur-3xl pointer-events-none" />

        <AlertDialogHeader className="relative space-y-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ring-8 ring-background transition-transform duration-300 hover:scale-105`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <div className="space-y-1.5 pt-1 flex-1">
              {/* Diperbesar untuk layar besar (menggunakan text-base sm:text-lg) */}
              <AlertDialogTitle className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground">
                {title}
              </AlertDialogTitle>
              {/* Diperbesar untuk layar besar (menggunakan text-xs sm:text-sm) */}
              <AlertDialogDescription className="text-xs sm:text-sm/relaxed text-muted-foreground font-normal">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {remark && (
          <div className="relative pt-4 pb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              {remarkName}
            </label>
            <Input
              placeholder={`Enter ${remarkName.toLowerCase()}...`}
              value={remarkValue}
              onChange={(e) => {
                setRemarkValue(e.target.value);
                onRemarkChange(e.target.value);
              }}
              className="h-11 rounded-xl bg-secondary/30 border-border/80 focus-visible:ring-primary text-sm shadow-inner"
            />
          </div>
        )}

        <AlertDialogFooter className="relative mt-6 pt-4 border-t border-border/60 flex gap-2.5 sm:gap-2.5">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={handleCancel}
            className="flex-1 rounded-xl border-border/80 bg-background hover:bg-secondary/80 text-xs sm:text-sm font-semibold h-11 px-4 mt-0 transition-all cursor-pointer shadow-xs"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleContinue}
            variant={config.buttonVariant}
            className="flex-1 rounded-xl text-xs sm:text-sm font-semibold h-11 px-4 shadow-sm transition-all cursor-pointer"
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
