import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary-secondary text-primary [a]:hover:bg-primary/10",
        secondary:
          "border-border bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        info: "border-info bg-info/10 text-info [a]:hover:bg-info/20",
        success:
          "border-success bg-success/10 text-success [a]:hover:bg-success/20",
        warning:
          "border-warning bg-warning/10 text-warning [a]:hover:bg-warning/20",
        destructive:
          "border-destructive bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        tenant:
          "border-tenant bg-tenant-secondary text-tenant [a]:hover:bg-tenant/10",
        owner:
          "border-owner bg-owner-secondary text-owner [a]:hover:bg-owner/10",
        supplier:
          "border-supplier bg-supplier-secondary text-supplier [a]:hover:bg-supplier/10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
