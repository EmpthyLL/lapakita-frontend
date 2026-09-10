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
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: ShieldAlert,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    buttonVariant: "warning" as const,
  },
  info: {
    icon: Info,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    buttonVariant: "info" as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    buttonVariant: "success" as const,
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
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {!isControlled && (
          <AlertDialogTrigger asChild>
            {children ?? (
              <Button variant={config.buttonVariant}>{confirmText}</Button>
            )}
          </AlertDialogTrigger>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-muted-foreground pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {remark && (
          <div className="py-2">
            <Input
              placeholder={`Enter ${remarkName}`}
              value={remarkValue}
              onChange={(e) => {
                setRemarkValue(e.target.value);
                onRemarkChange(e.target.value);
              }}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleContinue}
            variant={config.buttonVariant}
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
