import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Default Primary (Dynamic based on route: Tenant / Owner / Supplier) */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        "primary-secondary":
          "bg-primary-secondary text-primary border border-primary/20 hover:bg-primary/10",

        /* Fixed Explicit Roles */
        tenant:
          "bg-tenant text-tenant-foreground hover:bg-tenant/90 focus-visible:ring-tenant/50",
        "tenant-secondary":
          "bg-tenant-secondary text-tenant border border-tenant/30 hover:bg-tenant/10",

        owner:
          "bg-owner text-owner-foreground hover:bg-owner/90 font-semibold focus-visible:ring-owner/50",
        "owner-secondary":
          "bg-owner-secondary text-owner border border-owner/30 hover:bg-owner/10",

        supplier:
          "bg-supplier text-supplier-foreground hover:bg-supplier/90 focus-visible:ring-supplier/50",
        "supplier-secondary":
          "bg-supplier-secondary text-supplier border border-supplier/30 hover:bg-supplier/10",

        /* Statuses */
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/50",
        "outline-success":
          "border-success/30 bg-success/10 text-success hover:bg-success/20 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30",

        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning/50",
        "outline-warning":
          "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20 focus-visible:ring-warning/20 dark:bg-warning/20 dark:hover:bg-warning/30",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        "outline-destructive":
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",

        /* Standards */
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-4 has-[>svg]:pr-3 has-[>svg]:pl-3",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6 rounded-xl text-sm",
        icon: "size-10 rounded-lg",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  hasAccess?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      hasAccess = true,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (!hasAccess) return null;

    const Comp = asChild ? Slot : "button";

    const spinnerSize = size === "sm" || size === "xs" ? "size-3.5" : "size-4";

    const content = isLoading ? (
      <>
        <Loader2 className={cn(spinnerSize, "animate-spin")} />
        {!size?.toString().startsWith("icon") && (
          <span className="inline-flex items-center">{children}</span>
        )}
      </>
    ) : (
      children
    );

    return (
      <Comp
        data-slot="button"
        ref={ref}
        type={asChild ? undefined : "button"}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
