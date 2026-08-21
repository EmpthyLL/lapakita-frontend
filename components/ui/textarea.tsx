import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-xs transition-all outline-none",
        "placeholder:text-muted-foreground/70 placeholder:font-normal placeholder:transition-colors",

        /* Focus State Normal */
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",

        /* Disabled State */
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",

        /* Error State (Border & Focus Ring) */
        "aria-invalid:border-destructive group-data-[invalid=true]/field:border-destructive",
        "aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-2 aria-invalid:focus-visible:ring-destructive/20",
        "group-data-[invalid=true]/field:focus-visible:border-destructive group-data-[invalid=true]/field:focus-visible:ring-2 group-data-[invalid=true]/field:focus-visible:ring-destructive/20",

        /* Placeholder Error State (Ubah placeholder jadi merah) */
        "aria-invalid:placeholder:text-destructive/70",
        "group-data-[invalid=true]/field:placeholder:text-destructive/70",

        "md:text-xs dark:bg-input/30 dark:disabled:bg-input/80",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
