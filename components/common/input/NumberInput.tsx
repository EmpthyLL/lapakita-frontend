import { cn } from "@/lib/utils";
import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

export interface NumberInputProps extends NumericFormatProps {
  noSeparated?: boolean;
  hasError?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      decimalScale = 2,
      noSeparated = false,
      thousandSeparator = ",",
      value,
      hasError,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <NumericFormat
        getInputRef={ref}
        disabled={disabled}
        decimalScale={decimalScale === -1 ? undefined : decimalScale}
        thousandSeparator={!noSeparated ? thousandSeparator : ""}
        value={value}
        className={cn(
          "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-all outline-none",
          "placeholder:text-muted-foreground/70 placeholder:font-normal placeholder:transition-colors",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",

          /* Error States */
          "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:focus-visible:border-destructive group-data-[invalid=true]/field:focus-visible:ring-destructive/20",
          "aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20",
          hasError &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",

          /* Red Placeholder State */
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
NumberInput.displayName = "NumberInput";

export { NumberInput };
