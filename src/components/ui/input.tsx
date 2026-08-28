import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        data-slot="input"
        className={cn(
          "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-all outline-none",
          "placeholder:text-muted-foreground/70 placeholder:font-normal placeholder:transition-colors",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",

          /* Border Error State (Parent <Field data-invalid="true">, aria-invalid, or hasError) */
          "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:focus-visible:border-destructive group-data-[invalid=true]/field:focus-visible:ring-destructive/20",
          "aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20",
          hasError &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",

          /* Placeholder Error State (Ubah placeholder jadi merah) */
          "group-data-[invalid=true]/field:placeholder:text-destructive/70",
          "aria-invalid:placeholder:text-destructive/70",
          hasError && "placeholder:text-destructive/70",

          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
